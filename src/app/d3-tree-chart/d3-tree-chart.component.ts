import * as d3 from "d3";
import { Component, OnInit, Input } from '@angular/core';
import { treeData } from './example.json';
import { SimpleD3DraggingHandler } from '../d3/d3-drag-and-drop/d3-drag-and-drop-handler';
import { D3SelectionWrapper } from '../d3/d3-wrappers/d3-selection.wrapper';
import { D3TreeWrapper } from '../d3/d3-wrappers/d3-tree.wrapper';
import { SourceNodeModelFactory } from '../d3/node-models/factory/source-node-model.factory';
import { NodeModelGroupFactory } from '../d3/node-models/factory/node-model-group.factory';
import { ChartConfig } from '../d3/models/chart-config';
import { ChartSourceNodeModel } from '../d3/node-models/models/chart-source-node.model';
import { SimpleNodeModelFactoryPreparer, NodeModelFactory } from '../d3/node-models/models/node.model';
import { SecondSourceNodeModelFactory } from '../d3/node-models/factory/second-source-node-model.factory';

@Component({
  selector: 'app-d3-tree-chart',
  templateUrl: './d3-tree-chart.component.html',
  styleUrls: ['./d3-tree-chart.component.scss']
})
export class D3TreeChartComponent implements OnInit {

  @Input()
  public chartSources: ChartSourceNodeModel[] = treeData.sources;

  @Input()
  public chartData: any = treeData.tree;

  @Input()
  private chartConfig: ChartConfig = { marginLeft: 300 };

  private svgContainer: D3SelectionWrapper;

  private rootGroup: D3SelectionWrapper;

  private d3TreeWrapper: D3TreeWrapper;

  private nodeModelFactories: NodeModelFactory[] = [
    new SourceNodeModelFactory(new SimpleNodeModelFactoryPreparer()),
    new SecondSourceNodeModelFactory(new SimpleNodeModelFactoryPreparer())
  ];

  public constructor() {
  }

  ngOnInit() {
    this.svgContainer = D3SelectionWrapper.selectById('tree-chart')
      .appendSVG()
      .width(1500)
      .height(1500)
      .call(d3.zoom().on("zoom", () => this.rootGroup.transform(d3.event.transform)));
    this.svgContainer.appendBackgroundColorRect('lightgrey');
    this.rootGroup = this.svgContainer.appendGroup();

    this.d3TreeWrapper = new D3TreeWrapper(this.rootGroup, this.chartData, this.chartConfig);
    this.updateSourcesCoordinates(this.chartSources);
    this.createDnDSources(this.chartSources);
  }

  private createDnDSources(sources: ChartSourceNodeModel[]): void {
    this.nodeModelFactories.forEach(nodeModelFactory => {
      const simpleDragAndDropHandler: SimpleD3DraggingHandler = new SimpleD3DraggingHandler(
        this.rootGroup,
        this.chartConfig,
        () => this.d3TreeWrapper.getTreeRoot().descendants(),
        nodeModelFactory);

      const newGroups = NodeModelGroupFactory.create<ChartSourceNodeModel>(
        this.rootGroup,
        sources.filter(source => source.data.type === nodeModelFactory.type),
        nodeModelFactory);

      newGroups.cursor('pointer');
      newGroups.call(
        d3.drag()
          .on('start', simpleDragAndDropHandler.onDraggingStart.bind(simpleDragAndDropHandler))
          .on('drag', simpleDragAndDropHandler.onDragging.bind(simpleDragAndDropHandler))
          .on('end', simpleDragAndDropHandler.onDraggingEnd.bind(simpleDragAndDropHandler))
      );
    });
  }

  public appendNewSources(): void {
    const length: number = this.getRandomInt(this.chartSources.length);
    const indices: number[] = Array.apply(this, Array(length)).map(() => this.getRandomInt(this.chartSources.length))
    const filteredSources: ChartSourceNodeModel[] = this.chartSources.filter((source: any, index: number) => indices.includes(index));

    this.updateSourcesCoordinates(filteredSources);
    this.createDnDSources(filteredSources);
  }

  private getRandomInt(max: number): number {
    const result = Math.floor(Math.random() * Math.floor(max));
    return result !== 0 ? result : 1;
  }

  private updateSourcesCoordinates(sources: ChartSourceNodeModel[]): void {
    sources.forEach((source: ChartSourceNodeModel, index: number) => source.y = index * 100 + 100);
  }
}
