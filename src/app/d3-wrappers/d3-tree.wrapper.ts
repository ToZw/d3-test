import * as d3 from "d3";
import { D3SelectionTest, D3SelectionType, D3Selection } from './d3-selection-test';
import { D3TreeNodeFactory } from './node-models/d3-tree-node.factory';

export class D3TreeWrapper {

  private chartData: any;

  private chartConfig: any;

  private parentSelection: D3SelectionTest;

  private treeGroup: D3SelectionTest;

  private linkGroup: D3SelectionTest;

  private nodeGroup: D3SelectionTest;

  private treeRootNode: d3.HierarchyPointNode<any>;

  public constructor(parentSelection: D3SelectionTest, chartData: any, chartConfig: { marginLeft: number }) {
    this.parentSelection = parentSelection;
    this.chartData = chartData;
    this.chartConfig = chartConfig;

    this.init();
  }

  public getTreeRoot(): d3.HierarchyPointNode<any> {
    return this.treeRootNode;
  }

  private init(): void {
    this.treeGroup = this.parentSelection
      .appendGroup()
      .fontFamily("sans-serif")
      .fontSize(10)
      .transform(`translate(${this.chartConfig.marginLeft}, 0)`);

    this.updateTree();
  }

  private updateTree(): void {
    this.treeRootNode = this.getTreeFromData(this.chartData);

    this.createLinks();
    this.createNodes();
  }

  private getTreeFromData(data: any): d3.HierarchyPointNode<any> {
    const treemap: d3.TreeLayout<any> = d3.tree().size([1000, 1000]);
    const nodes: d3.HierarchyNode<any> = d3.hierarchy(data, node => node.children);

    return treemap(nodes);
  }

  private createLinks(): void {
    if (!this.linkGroup) {
      this.linkGroup = this.treeGroup
        .appendGroup()
        .fill("none")
        .stroke("#555")
        .strokeOpacity(0.4)
        .strokeWidth(1.5)
        .id('links');
    }

    this.linkGroup
      .selectAll(D3SelectionType.PATH)
      .data<d3.HierarchyPointLink<any>>(this.treeRootNode.links(), link => link.source.data.id + '_' + link.target.data.id)
      .join(D3SelectionType.PATH)
      .d(d3.linkHorizontal<any, any>()
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

  private createNodes(): void {
    if (!this.nodeGroup) {
      this.nodeGroup = this.treeGroup
        .appendGroup()
        .id('targets');
    }

    D3TreeNodeFactory.create(this, this.nodeGroup, this.treeRootNode.descendants());
  }

  public addNode(node: d3.HierarchyPointNode<any>, newChild: any) {
    if (!node.data.children) {
      node.data.children = [];
    }

    node.data.children.push(newChild);
    this.updateTree();
  }
}
