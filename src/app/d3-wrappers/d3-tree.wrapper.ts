import * as d3 from "d3";
import { D3SelectionWrapper, D3SelectionType } from './d3-selection.wrapper';
import { D3NodeModelFactory } from './node-models/d3-node-model.factory';
import { NodeModelType } from './node-models/node.model';
import { TargetTreeNodeModel } from './node-models/tree-node-models/target-tree-node.model';
import { TestoTreeNodeModel } from './node-models/tree-node-models/testo-tree-node.model';

export class D3TreeWrapper {

  private chartData: any;

  private chartConfig: any;

  private parentSelection: D3SelectionWrapper;

  private treeGroup: D3SelectionWrapper;

  private linkGroup: D3SelectionWrapper;

  private nodeGroup: D3SelectionWrapper;

  private treeRootNode: d3.HierarchyPointNode<any>;

  public constructor(parentSelection: D3SelectionWrapper, chartData: any, chartConfig: { marginLeft: number }) {
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

  private getTreeFromData(data: any): d3.HierarchyPointNode<any> {
    const treemap: d3.TreeLayout<any> = d3.tree().size([1000, 1000]);
    const nodes: d3.HierarchyNode<any> = d3.hierarchy(data, node => node.children);

    return treemap(nodes);
  }

  private updateLinks(): void {
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

  private updateNodes() {
    const descendants: d3.HierarchyPointNode<any>[] = this.treeRootNode.descendants();

    D3NodeModelFactory.create(this.nodeGroup, descendants.filter(node => node.data.type === NodeModelType.TARGET), new TargetTreeNodeModel(this));
    D3NodeModelFactory.create(this.nodeGroup, descendants.filter(node => node.data.type === NodeModelType.TESTO), new TestoTreeNodeModel(this));
  }

  public addNode(node: d3.HierarchyPointNode<any>, newChild: any) {
    if (!node.data.children) {
      node.data.children = [];
    }

    node.data.children.push(newChild);
    this.updateTree();
  }
}
