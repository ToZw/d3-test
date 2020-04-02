import * as d3 from "d3";
import { D3SelectionWrapper, D3SelectionType } from '../d3-selection.wrapper';
import { NodeModel } from './node.model';

export class D3NodeModelFactory {

  /**
   * This Function is creating a group (if not existing) for the nodes with the id from {@field NodeModel.type}.
   * Creating the nodes and append them.
   *
   * @param parentSelection
   * @param nodes
   * @param nodeModel
   */
  public static create(parentSelection: D3SelectionWrapper, nodes: d3.HierarchyPointNode<any>[], nodeModel: NodeModel): void {
    if (!nodeModel) {
      throw new Error(`The parameter 'nodeModel' is required!, ${nodeModel}`);
    }

    let modelGroup: D3SelectionWrapper = parentSelection.selectById(nodeModel.type);

    if (modelGroup.empty()) {
      modelGroup = parentSelection
        .appendGroup()
        .id(nodeModel.type);
    }

    const nodeGroups: D3SelectionWrapper = modelGroup
      .selectAll(D3SelectionType.GROUP)
      .data<d3.HierarchyPointNode<any>>(nodes, node => node.data.id)
      .join(D3SelectionType.GROUP)
      .dndType((node) => node.data.dndType)
      .type((node) => node.data.type)
      .id((node) => node.data.id)
      .x((node) => node.x)
      .y((node) => node.y);

    nodeModel.createNodes(nodeGroups);
  }
}
