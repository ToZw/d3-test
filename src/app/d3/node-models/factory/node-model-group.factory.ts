import { D3SelectionWrapper, D3SelectionType } from '../../d3-wrappers/d3-selection.wrapper';
import { NodeModelFactory, NodeModelProperties } from '../models/node.model';

export class NodeModelGroupFactory {

  /**
   * This Function is creating a group (if not existing) for the nodes with the id from {@field NodeModel.type}.
   * Creating the nodes and append them.
   *
   * @param parentSelection
   * @param nodeData
   * @param nodeModelFactory
   */
  public static create<NodeData extends NodeModelProperties>(parentSelection: D3SelectionWrapper, nodeData: NodeData[], nodeModelFactory: NodeModelFactory): void {
    if (!nodeModelFactory) {
      throw new Error(`The parameter 'nodeModelFactory' is required!, ${nodeModelFactory}`);
    }

    let modelGroup: D3SelectionWrapper = parentSelection.selectById(nodeModelFactory.type);

    if (modelGroup.empty()) {
      modelGroup = parentSelection
        .appendGroup()
        .id(nodeModelFactory.type);
    }

    const nodeGroups: D3SelectionWrapper = modelGroup
      .selectAll(D3SelectionType.GROUP)
      .data<NodeData>(nodeData, (node: NodeData) => node.data.id)
      .join(D3SelectionType.GROUP)
      .dndType((node: NodeData) => node.data.dndType)
      .type((node: NodeData) => node.data.type)
      .id((node: NodeData) => node.data.id);

    nodeModelFactory.createNodes(nodeGroups);
  }
}
