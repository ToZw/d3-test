import * as d3 from "d3";
import { Component, OnInit, Input } from '@angular/core';
import { treeData } from './example.json';
import { D3SelectionTest, D3SelectionType } from '../d3-wrappers/d3-selection-test';
import { DnDModuleType, DnDModule, DnDSourceModule } from '../d3-chart/d3-chart.component';
import { D3TreeWrapper } from '../d3-wrappers/d3-tree.wrapper';

@Component({
  selector: 'app-d3-tree-chart',
  templateUrl: './d3-tree-chart.component.html',
  styleUrls: ['./d3-tree-chart.component.scss']
})
export class D3TreeChartComponent implements OnInit {

  @Input()
  public chartData: any = treeData.tree;

  private svgContainer: D3SelectionTest;

  private rootGroup: D3SelectionTest;

  private zoom: number = 1554;

  private currentDragSelection: D3SelectionTest;

  private hoveredTargetSelection: D3SelectionTest;

  private marginLeft: number = 300;

  private d3TreeWrapper: D3TreeWrapper;

  public constructor() {
  }

  ngOnInit() {
    this.svgContainer = D3SelectionTest.select('#tree-chart')
      .appendSVG()
      .width(1500)
      .height(1500)
      .call(d3.zoom().on("zoom", () => this.rootGroup.transform(d3.event.transform)));
    this.svgContainer.appendBackgroundColorRect('lightgrey');
    this.rootGroup = this.svgContainer.appendGroup();

    this.createDnDSources(treeData.sources);
    this.d3TreeWrapper = new D3TreeWrapper(this.rootGroup, this.chartData, { marginLeft: 300 });
  }

  private createDnDSources(sources: DnDSourceModule[]): void {
    const groups: D3SelectionTest = this.rootGroup
      .selectAll(D3SelectionType.GROUP)
      .data<DnDModule>(sources, source => source.id)
      .join(D3SelectionType.GROUP)
      .transform((data) => `translate(${data.x}, ${data.y})`)
      .dndType((data) => data.dndType)
      .id((data) => data.id)
      .cursor('pointer');

    groups
      .appendRect()
      .width(data => data.width)
      .height(data => data.height)
      .fill('white')
      .setSolidBorder();

    groups
      .appendText()
      .centerTextInRect()
      .text((data) => data.value);

    groups.call(
      d3.drag()
        .on('start', (data: DnDSourceModule) => this.onDraggingStart(data))
        .on('drag', (data: DnDSourceModule) => this.onDragging(data))
        .on('end', (data: DnDSourceModule) => this.onDraggingEnd(data))
    );
  }

  private onDraggingStart(data: DnDSourceModule) {
    this.createDraggingSource(data);
  }

  private createDraggingSource(data: DnDSourceModule) {
    this.currentDragSelection = this.rootGroup
      .appendGroup()
      .datum<DnDSourceModule>(data)
      .transform((data) => `translate(${data.x}, ${data.y})`);

    this.currentDragSelection
      .datum<DnDSourceModule>(data)
      .appendRect()
      .width(data => data.width)
      .height(data => data.height)
      .fill('white')
      .setSolidBorder();

    this.currentDragSelection
      .datum(data)
      .appendText()
      .centerTextInRect()
      .text((data) => data.value);
  }

  private onDragging(data: DnDSourceModule) {
    this.currentDragSelection.transform((data) => `translate(${d3.event.x}, ${d3.event.y})`);

    // if (this.draggingTimeout) {
    //   return;
    // }

    // this.draggingTimeout = setTimeout(() => this.draggingTimeout = null, 100);

    const newHoveredTargetSelection: D3SelectionTest | null = this.findHoveredTargetModule(data);

    if (!newHoveredTargetSelection
      || (this.hoveredTargetSelection && newHoveredTargetSelection.getId() !== this.hoveredTargetSelection.getId())) {

      if (this.hoveredTargetSelection) {
        this.hoveredTargetSelection
          .selectFirstRect()
          .stroke('#2378ae');
      }

      this.hoveredTargetSelection = newHoveredTargetSelection;
      return;
    }

    this.hoveredTargetSelection = newHoveredTargetSelection;
    this.hoveredTargetSelection
      .selectFirstRect()
      .stroke('red');
  }

  private findHoveredTargetModule(data: DnDSourceModule): D3SelectionTest | null {
    // const targetModules: d3.HierarchyPointNode<any>[] = this.treeRoot
    const targetModules: d3.HierarchyPointNode<any>[] = this.d3TreeWrapper
      .getTreeRoot()
      .descendants()
      .filter(module => module.data.dndType === DnDModuleType.DND_TARGET)
      .filter(
        module => {
          const moduleHalfHeight: number = module.data.height / 2;
          const draggingModule = { top: d3.event.y, left: d3.event.x - this.marginLeft, right: d3.event.x + data.width - this.marginLeft, bottom: d3.event.y + data.height };
          const targetModule = { top: module.x - moduleHalfHeight, left: module.y, right: module.y + module.data.width, bottom: module.x + moduleHalfHeight };

          return this.isIntersection(targetModule, draggingModule);
        });

    if (targetModules.length === 0) {
      return null;
    }

    return this.rootGroup.select(`#${targetModules[0].data.id}`);
  }

  private isIntersection(first: { top: number, right: number, bottom: number, left: number }, second: { top: number, right: number, bottom: number, left: number }) {
    return !(second.left > first.right ||
      second.right < first.left ||
      second.top > first.bottom ||
      second.bottom < first.top);
  }

  private onDraggingEnd(data: DnDSourceModule) {
    if (this.hoveredTargetSelection) {
      this.hoveredTargetSelection
        .selectFirstRect()
        .stroke('#2378ae');
      this.hoveredTargetSelection = null;
    }

    const targetSelection = this.findHoveredTargetModule(data);

    if (!targetSelection) {
      this.currentDragSelection.remove();
      this.currentDragSelection = null;
      return;
    }

    /* update group*/
    targetSelection.transform(node => `translate(${node.y}, ${node.x - data.height / 2})`);

    const node: d3.HierarchyPointNode<any> = targetSelection.getDatum();

    node.data.width = data.width;
    node.data.height = data.height;

    /* update rect */
    targetSelection
      .selectFirstRect()
      // .y(data.height / 2)
      .width(data.width)
      .height(data.height)
      .fill('white')
      .setSolidBorder();

    /* update text */
    targetSelection
      .selectFirstText()
      .centerTextInRect({ rectWidth: data.width, rectHeight: data.height })
      .text(data.value);

    /* update add-button */
    targetSelection
      .selectFirstPath()
      .transform(`translate(${data.width}, 0)`);

    this.currentDragSelection.remove();
    this.currentDragSelection = null;
  }
}
