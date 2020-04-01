import * as d3 from "d3";
import { D3SelectionTest, D3SelectionType } from '../d3-selection-test';
import { D3TreeWrapper } from '../d3-tree.wrapper';
import { DnDTargetNodeModel } from './dnd-target-node.model';
import { NodeModel, NodeModelType } from './node.model';
import { DnDTestoNodeModel } from './dnd-testo-node.model';
import { SourceNodeModel } from './source-node.model';

export class D3TreeNodeFactory {

  private static readonly NODE_MODEL_MAP: Map<string, NodeModel> = new Map<string, NodeModel>(
    [
      [NodeModelType.SOURCE, new SourceNodeModel()],
      [NodeModelType.TARGET, new DnDTargetNodeModel()],
      [NodeModelType.TESTO, new DnDTestoNodeModel()]
    ]
  );

  public static create(d3TreeWrapper: D3TreeWrapper, parentSelection: D3SelectionTest, nodes: d3.HierarchyPointNode<any>[]): void {
    this.createNodeTypeMap(nodes).forEach((value: d3.HierarchyPointNode<any>[], key: string) => {
      let modelGroup = parentSelection.selectById(key);

      if (modelGroup.empty()) {
        modelGroup = parentSelection
          .appendGroup()
          .id(key);
      }

      const nodeGroups = modelGroup
        .selectAll(D3SelectionType.GROUP)
        .data<d3.HierarchyPointNode<any>>(value, node => node.data.id)
        .join(D3SelectionType.GROUP)
        .dndType((node) => node.data.dndType)
        .type((node) => node.data.type)
        .id((node) => node.data.id);

      const nodeModel: NodeModel = D3TreeNodeFactory.NODE_MODEL_MAP.get(key);

      if (!nodeModel) {
        throw new Error(`The type '${key}' is not supported yet!`);
      }

      nodeModel.createNodes(d3TreeWrapper, nodeGroups);
    });
  }

  private static createNodeTypeMap(nodes: d3.HierarchyPointNode<any>[]) {
    const nodetypeMap: Map<string, d3.HierarchyPointNode<any>[]> = new Map<string, d3.HierarchyPointNode<any>[]>();

    nodes.forEach(node => {
      const type: string = node.data.type;
      let foundNodes: d3.HierarchyPointNode<any>[] = nodetypeMap.get(type);

      if (!foundNodes) {
        foundNodes = [];
        nodetypeMap.set(type, foundNodes);
      }

      foundNodes.push(node);
    });

    return nodetypeMap;
  }
}
