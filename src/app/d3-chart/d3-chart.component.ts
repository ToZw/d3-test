import * as d3 from "d3";
import { Component, OnInit, Input } from '@angular/core';
import { D3SelectionTest, D3SelectionType } from '../d3-wrappers/d3-selection-test';

@Component({
  selector: 'app-d3-chart',
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.scss']
})
export class D3ChartComponent implements OnInit {

  @Input()
  public modules: DnDModule[] = [
    { type: DnDModuleType.DND_SOURCE, id: 'source_1', x: 50, y: 100, width: 100, height: 100, value: 'Source 1' } as DnDSourceModule,
    { type: DnDModuleType.DND_SOURCE, id: 'source_2', x: 50, y: 300, width: 100, height: 100, value: 'Source 2' } as DnDSourceModule,
    { type: DnDModuleType.DND_TARGET, id: 'target_1', x: 200, y: 10, width: 100, height: 100 },
    { type: DnDModuleType.DND_TARGET, id: 'target_2', x: 400, y: 10, width: 100, height: 100 },
    { type: DnDModuleType.DND_TARGET, id: 'target_3', x: 600, y: 10, width: 100, height: 100 },
  ];

  @Input()
  public links: D3Link[] = [
    { id: 'link_1', sourceId: 'target_1', targetId: 'target_2' },
    { id: 'link_2', sourceId: 'target_2', targetId: 'target_3' }
  ]

  private svgContainer: D3SelectionTest;

  // private draggingTimeout: any;

  private currentDragSelection: D3SelectionTest;

  private hoveredTargetSelection: D3SelectionTest;

  public constructor() {
  }

  ngOnInit() {
    this.svgContainer = D3SelectionTest
      .select('#dnd-chart')
      .appendSVG()
      .width(1500)
      .height(1500);

    const groups: D3SelectionTest = this.initGroups();

    this.createDnDSources(this.filterGroups(groups, DnDModuleType.DND_SOURCE));
    this.createDnDTargets(this.filterGroups(groups, DnDModuleType.DND_TARGET));
  }

  /**
   * This function filtering the groups with the given {@enum DnDModuleType}.
   *
   * @param groups all groups, not {@code null}
   * @param filterSubType {@enum DnDModuleType} which should be filtered or {@code null}
   */
  private filterGroups(groups: D3SelectionTest, filterSubType: DnDModuleType): D3SelectionTest {
    if (!groups) {
      throw new Error(`The parameter 'groups' is required!, ${groups}`);
    }

    return groups.filter(`g[type="${filterSubType}"]`);
  }

  private initGroups(): D3SelectionTest {
    return this.svgContainer
      .selectAll(D3SelectionType.GROUP)
      .data<DnDModule>(this.modules, module => module.id)
      .enter()
      .appendGroup()
      .transform((data) => `translate(${data.x}, ${data.y})`)
      .type((data) => data.type)
      .id((data) => data.id);
  }

  private createDnDSources(groups: D3SelectionTest): void {
    groups
      .appendRect()
      .width(data => data.width)
      .height(data => data.height)
      .fill('white')
      .setSolidBorder();
    groups
      .appendText()
      .x((data) => data.width / 4)
      .y((data) => data.height / 2)
      .dy('.35em')
      .text((data) => data.value);

    groups.call(
      d3.drag()
        .on('start', (data: DnDSourceModule, index: number, elementGroup: any) => {
          this.createDraggingSource(data, index, elementGroup);
        })
        .on('drag', (data: DnDSourceModule) => {
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
        })
        .on('end', (data: DnDSourceModule) => {
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

          targetSelection
            .selectFirstRect()
            .width(data.width)
            .height(data.height)
            .fill('white')
            .setSolidBorder();

          targetSelection
            .selectFirstText()
            .text(data.value);

          this.currentDragSelection.remove();
          this.currentDragSelection = null;
        })
    );
  }

  private findHoveredTargetModule(data: DnDSourceModule): D3SelectionTest | null {
    const targetModules: DnDTargetModule[] = this.modules
      .filter(module => module.type === DnDModuleType.DND_TARGET)
      .filter(
        module => this.isIntersection(
          { top: module.y, right: module.x + module.width, bottom: module.y + module.height, left: module.x },
          { top: d3.event.y, right: d3.event.x + data.width, bottom: d3.event.y + + data.height, left: d3.event.x })) as DnDTargetModule[];

    if (targetModules.length === 0) {
      return null;
    }

    return this.svgContainer.select(`#${targetModules[0].id}`);
  }

  private isIntersection(first: { top: number, right: number, bottom: number, left: number }, second: { top: number, right: number, bottom: number, left: number }) {
    return !(second.left > first.right ||
      second.right < first.left ||
      second.top > first.bottom ||
      second.bottom < first.top);
  }

  private createDnDTargets(groups: D3SelectionTest): void {
    const defaultWidth: number = 25;

    groups
      .appendRect()
      .width(data => data.width ? data.width : defaultWidth)
      .height(data => data.height ? data.height : defaultWidth)
      .fill('white')
      .stroke('#2378ae')
      .strokeDasharray('10,5')
      .strokeLinecap('butt')
      .strokeWidth('3');

    groups
      .appendText()
      .x((data) => (data.width ? data.width : defaultWidth) / 4)
      .y((data) => (data.height ? data.height : defaultWidth) / 2)
      .dy('.35em')
      .text('Drag here');

    groups
      .appendPath()
      .setSymbol(
        d3.symbol()
          .size(300)
          .type(d3.symbolCross))
      .transform((data) => `translate(${data.width + 25}, ${data.height / 2})`)
      .onClick((data) => this.addDnDTargetModule({ type: DnDModuleType.DND_TARGET, id: data.id + (data.x + 200), x: data.x + 200, y: data.y, width: 100, height: 100 }));

    groups
      .appendPath()
      .setSymbol(
        d3.symbol()
          .size(300)
          .type(d3.symbolCross))
      .transform((data) => `translate(${data.width / 2}, ${data.height + 25})`)
      .onClick((data) => this.addDnDTargetModule({ type: DnDModuleType.DND_TARGET, id: data.id + (data.y + 200), x: data.x, y: (data.y + 200), width: 100, height: 100 }));
  }

  private addDnDTargetModule(newModule: DnDTargetModule) {
    this.modules.push(newModule);
    const newGroup = this.initGroups();
    this.createDnDTargets(newGroup);
  }

  private createDraggingSource(data: DnDSourceModule, index: number, elementGroup: any) {
    this.currentDragSelection = this.svgContainer
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
      .x((data) => data.width / 4)
      .y((data) => data.height / 2)
      .dy('.35em')
      .text((data) => data.value);
  }
}

export enum DnDModuleType {
  DND_SOURCE = 'DnDSource',
  DND_TARGET = 'DnDTarget'
}

export interface DnDModule {
  type: DnDModuleType;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  linkIds?: string[];
}

export interface D3Link {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface DnDSourceModule extends DnDModule {
  type: DnDModuleType.DND_SOURCE;
  value: string;
}

export interface DnDTargetModule extends DnDModule {
  type: DnDModuleType.DND_TARGET;
}
