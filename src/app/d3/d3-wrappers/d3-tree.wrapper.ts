import * as d3 from "d3";
import { D3SelectionWrapper, D3SelectionType } from './d3-selection.wrapper';
import { NodeModelGroupFactory } from '../node-models/factory/node-model-group.factory';
import { NodeModelType } from '../node-models/models/node.model';
import { TargetTreeNodeModelFactory } from '../node-models/tree-node-models/factory/target-tree-node-model.factory';
import { TestoTreeNodeModelFactory } from '../node-models/tree-node-models/factory/testo-tree-node-model.factory';
import { ChartConfig } from '../models/chart-config';
import { ChartTreeNodeDataModelProperties } from '../node-models/tree-node-models/models/chart-tree-node-data.model';

export class D3TreeWrapper {

  private chartData: ChartTreeNodeDataModelProperties;

  private chartConfig: ChartConfig;

  private parentSelection: D3SelectionWrapper;

  private treeGroup: D3SelectionWrapper;

  private linkGroup: D3SelectionWrapper;

  private nodeGroup: D3SelectionWrapper;

  private treeRootNode: d3.HierarchyPointNode<ChartTreeNodeDataModelProperties>;

  public constructor(parentSelection: D3SelectionWrapper, chartData: ChartTreeNodeDataModelProperties, chartConfig: ChartConfig) {
    this.parentSelection = parentSelection;
    this.chartData = chartData;
    this.chartConfig = chartConfig;

    this.init();
  }

  public getTreeRoot(): d3.HierarchyPointNode<ChartTreeNodeDataModelProperties> {
    return this.treeRootNode;
  }

  private init(): void {
    this.treeGroup = this.parentSelection
      .appendGroup()
      .fontFamily("sans-serif")
      .fontSize(10)
      .transform(`translate(${this.chartConfig.marginLeft}, 0)`);

    this.linkGroup = this.treeGroup
      .appendGroup()
      .fill("none")
      .stroke("#555")
      .strokeOpacity(0.4)
      .strokeWidth(1.5)
      .id('links');

    this.nodeGroup = this.treeGroup
      .appendGroup()
      .id('targets');

    this.updateTree();
  }

  private updateTree(): void {
    this.treeRootNode = this.getTreeFromData(this.chartData);

    this.updateLinks();
    this.updateNodes();
  }

  private getTreeFromData(data: ChartTreeNodeDataModelProperties): d3.HierarchyPointNode<ChartTreeNodeDataModelProperties> {
    const treemap: d3.TreeLayout<ChartTreeNodeDataModelProperties> = d3.tree<ChartTreeNodeDataModelProperties>().size([1000, 1000]);
    const nodes: d3.HierarchyNode<ChartTreeNodeDataModelProperties> = d3.hierarchy<ChartTreeNodeDataModelProperties>(data, node => node.children);

    return treemap(nodes);
  }

  private updateLinks(): void {
    this.linkGroup
      .selectAll(D3SelectionType.PATH)
      .data<d3.HierarchyPointLink<ChartTreeNodeDataModelProperties>>(
        this.treeRootNode.links(),
        (link: d3.HierarchyPointLink<ChartTreeNodeDataModelProperties>) => link.source.data.id + '_' + link.target.data.id)
      .join(D3SelectionType.PATH)
      .d(d3.linkHorizontal<d3.HierarchyPointNode<ChartTreeNodeDataModelProperties>, d3.HierarchyPointNode<ChartTreeNodeDataModelProperties>>()
        .x(link => link.y)
        .y(link => link.x));

    /* Just for debugging: to see which link refers to which source/target-nodes */
    // this.linkGroup
    //   .selectAll(D3SelectionType.TEXT)
    //   .data<d3.HierarchyPointLink<any>>(this.treeRootNode.links(), link => link.source.data.id + '_' + link.target.data.id)
    //   .join(D3SelectionType.TEXT)
    //   .x(link => link.target.y - 200)
    //   .y(link => link.target.x)
    //   .text(link => link.source.data.id + ' => ' + link.target.data.id);
  }

  private updateNodes() {
    const descendants: d3.HierarchyPointNode<ChartTreeNodeDataModelProperties>[] = this.treeRootNode.descendants();

    NodeModelGroupFactory.create(this.nodeGroup, descendants.filter(node => node.data.type === NodeModelType.TARGET), new TargetTreeNodeModelFactory(this));
    NodeModelGroupFactory.create(this.nodeGroup, descendants.filter(node => node.data.type === NodeModelType.TESTO), new TestoTreeNodeModelFactory(this));
  }

  public addNode(node: d3.HierarchyPointNode<any>, newChild: any) {
    if (!node.data.children) {
      node.data.children = [];
    }

    node.data.children.push(newChild);
    this.updateTree();
  }
}
