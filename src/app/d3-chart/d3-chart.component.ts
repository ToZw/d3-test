import * as d3 from "d3";
import { Component, OnInit, Input } from '@angular/core';
import { DnDTargetModuleModel } from '../d3-wrappers/models/dnd-target-module.model';
import { DnDSourceModuleModel } from '../d3-wrappers/models/dnd-source-module.model';
import { D3DnDSelection, D3SelectionType } from '../d3-wrappers/d3-selection.wrapper';
import { D3GroupWrapper } from '../d3-wrappers/d3-group.wrapper';

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

  private svgContainer: D3DnDSelection;

  // private draggingTimeout: any;

  private currentDragSelection: D3GroupWrapper<DnDSourceModule>;

  private hoveredTargetSelection: DnDTargetModuleModel;

  public constructor() {
  }

  ngOnInit() {
    this.svgContainer = d3.select('body')
      .append('svg')
      .attr('width', 1500)
      .attr('height', 1500) as D3DnDSelection;

    const groups: D3DnDSelection<DnDModule> = this.initGroups();

    this.createDnDSources(this.filterGroups(groups, DnDModuleType.DND_SOURCE));
    this.createDnDTargets(this.filterGroups(groups, DnDModuleType.DND_TARGET));
  }

  /**
   * This function filtering the groups with the given {@enum DnDModuleType}.
   *
   * @param groups all groups, not {@code null}
   * @param filterSubType {@enum DnDModuleType} which should be filtered or {@code null}
   */
  private filterGroups<SUBTYPE extends DnDModule>(groups: D3DnDSelection<DnDModule>, filterSubType: DnDModuleType): D3DnDSelection<SUBTYPE> {
    if (!groups) {
      throw new Error(`The parameter 'groups' is required!, ${groups}`);
    }

    return groups.filter(`g[type="${filterSubType}"]`) as D3DnDSelection<SUBTYPE>;
  }

  private initGroups(): D3DnDSelection<DnDModule> {
    return this.svgContainer
      .selectAll(D3SelectionType.GROUP)
      .data(this.modules)
      .enter()
      .append(D3SelectionType.GROUP)
      .attr('transform', (data) => `translate(${data.x}, ${data.y})`)
      .attr('type', (data) => data.type)
      .attr('id', (data) => data.id)
  }

  private createDnDSources(groups: d3.Selection<SVGGElement, DnDSourceModule, d3.BaseType, any>) {
    new DnDSourceModuleModel(groups).build();

    // groups.call(addDnDDragging<DnDSourceModule, DnDTargetModule>(DnDModuleType.DND_SOURCE, DnDModuleType.DND_TARGET));
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

          const newHoveredTargetSelection: DnDTargetModuleModel<DnDTargetModule> | null = this.findHoveredTargetModule(data);

          if (!newHoveredTargetSelection
            || (this.hoveredTargetSelection && newHoveredTargetSelection.getGroup().getId() !== this.hoveredTargetSelection.getGroup().getId())) {

            if (this.hoveredTargetSelection) {
              this.hoveredTargetSelection
                .getGroup()
                .selectFirstRect()
                .stroke('#2378ae');
            }

            this.hoveredTargetSelection = newHoveredTargetSelection;
            return;
          }

          this.hoveredTargetSelection = newHoveredTargetSelection;
          this.hoveredTargetSelection
            .getGroup()
            .selectFirstRect()
            .stroke('red');
        })
        .on('end', (data: DnDSourceModule) => {
          if (this.hoveredTargetSelection) {
            this.hoveredTargetSelection
              .getGroup()
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
            .getGroup()
            .selectFirstRect()
            .width(data.width)
            .height(data.height)
            .fill('white')
            .setSolidBorder();

          targetSelection
            .getGroup()
            .selectFirstText()
            .text(data.value);

          this.currentDragSelection.remove();
          this.currentDragSelection = null;
        })
    );
  }

  private findHoveredTargetModule(data: DnDSourceModule): DnDTargetModuleModel<DnDTargetModule> | null {
    const targetModules: DnDTargetModule[] = this.modules
      .filter(module => module.type === DnDModuleType.DND_TARGET)
      .filter(
        module => this.isIntersection(
          { top: module.y, right: module.x + module.width, bottom: module.y + module.height, left: module.x },
          { top: d3.event.y, right: d3.event.x + data.width, bottom: d3.event.y + + data.height, left: d3.event.x })) as DnDTargetModule[];

    if (targetModules.length === 0) {
      return null;
    }

    return new DnDTargetModuleModel(this.svgContainer.select(`#${targetModules[0].id}`) as D3DnDSelection<DnDTargetModule>);
  }

  private isIntersection(first: { top: number, right: number, bottom: number, left: number }, second: { top: number, right: number, bottom: number, left: number }) {
    return !(second.left > first.right ||
      second.right < first.left ||
      second.top > first.bottom ||
      second.bottom < first.top);
  }

  private createDnDTargets(groups: D3DnDSelection<DnDTargetModule>) {
    new DnDTargetModuleModel(groups)
      .build(
        (data) => this.addDnDTargetModule({ type: DnDModuleType.DND_TARGET, id: data.id + (data.x + 200), x: data.x + 200, y: data.y, width: 100, height: 100 }),
        (data) => this.addDnDTargetModule({ type: DnDModuleType.DND_TARGET, id: data.id + (data.y + 200), x: data.x, y: (data.y + 200), width: 100, height: 100 })
      );
  }

  private addDnDTargetModule(newModule: DnDTargetModule) {
    this.modules.push(newModule);
    const newGroup = this.initGroups();
    this.createDnDTargets(newGroup as D3DnDSelection<DnDTargetModule>);
  }

  private createDraggingSource(data: DnDSourceModule, index: number, elementGroup: any) {
    this.currentDragSelection = D3GroupWrapper.create<DnDSourceModule>(this.svgContainer as any)
      .datum(data)
      .transform((data) => `translate(${data.x}, ${data.y})`);

    this.currentDragSelection
      .datum(data)
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
