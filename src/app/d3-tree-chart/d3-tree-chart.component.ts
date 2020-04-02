import * as d3 from "d3";
import { Component, OnInit, Input } from '@angular/core';
import { treeData } from './example.json';
import { D3SelectionWrapper } from '../d3-wrappers/d3-selection.wrapper';
import { DnDSourceModule } from '../d3-chart/d3-chart.component';
import { D3TreeWrapper } from '../d3-wrappers/d3-tree.wrapper';
import { D3NodeModelFactory } from '../d3-wrappers/node-models/d3-node-model.factory';
import { SourceNodeModel } from '../d3-wrappers/node-models/source-node.model';
import { SimpleD3DraggingHandler } from '../drag-and-drop/d3-drag-and-drop-handler';

@Component({
  selector: 'app-d3-tree-chart',
  templateUrl: './d3-tree-chart.component.html',
  styleUrls: ['./d3-tree-chart.component.scss']
})
export class D3TreeChartComponent implements OnInit {

  @Input()
  public chartSources: any[] = treeData.sources;

  @Input()
  public chartData: any = treeData.tree;

  @Input()
  private chartConfig: { marginLeft: number } = { marginLeft: 300 };

  private svgContainer: D3SelectionWrapper;

  private rootGroup: D3SelectionWrapper;

  private d3TreeWrapper: D3TreeWrapper;

  public constructor() {
  }

  ngOnInit() {
    this.svgContainer = D3SelectionWrapper.select('#tree-chart')
      .appendSVG()
      .width(1500)
      .height(1500)
      .call(d3.zoom().on("zoom", () => this.rootGroup.transform(d3.event.transform)));
    this.svgContainer.appendBackgroundColorRect('lightgrey');
    this.rootGroup = this.svgContainer.appendGroup();

    this.d3TreeWrapper = new D3TreeWrapper(this.rootGroup, this.chartData, this.chartConfig);
    this.createDnDSources(this.chartSources);
  }

  private createDnDSources(sources: DnDSourceModule[]): void {
    const dragAndDropHandler: SimpleD3DraggingHandler = new SimpleD3DraggingHandler(
      this.rootGroup,
      this.chartConfig,
      () => this.d3TreeWrapper.getTreeRoot().descendants(),
      new SourceNodeModel())

    this.updateSourcesCoordinates(this.chartSources);
    D3NodeModelFactory.create(this.rootGroup, sources as any, new SourceNodeModel(dragAndDropHandler));
  }

  public appendNewSources() {
    const length: number = this.getRandomInt(this.chartSources.length);
    const indices: number[] = Array.apply(this, Array(length)).map(() => this.getRandomInt(this.chartSources.length - 1))
    const filteredSources: any[] = this.chartSources.filter((source: any, index: number) => indices.includes(index));

    this.updateSourcesCoordinates(filteredSources);
    this.createDnDSources(filteredSources);
  }

  private getRandomInt(max: number): number {
    const result = Math.floor(Math.random() * Math.floor(max));
    return result !== 0 ? result : 1;
  }

  private updateSourcesCoordinates(sources: any[]): void {
    sources.forEach((source: any, index: number) => source.y = index * 100 + 100);
  }
}
