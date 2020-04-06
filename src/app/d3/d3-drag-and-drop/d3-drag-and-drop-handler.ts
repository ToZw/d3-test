import * as d3 from "d3";
import { DnDModuleType } from '../../d3-chart/d3-chart.component';
import { D3SelectionWrapper } from '../d3-wrappers/d3-selection.wrapper';
import { NodeModelFactory, NodeModelProperties, NodeModelType, NodeDataModelProperties } from '../node-models/models/node.model';
import { ChartConfig } from '../models/chart-config';

export interface D3DraggingHandler<DataNode extends NodeModelProperties> {
  onDraggingStart: d3.ValueFn<d3.BaseType, DataNode, void>;
  onDragging: d3.ValueFn<d3.BaseType, DataNode, void>;
  onDraggingEnd: d3.ValueFn<d3.BaseType, DataNode, void>;
}

export class SimpleD3DraggingHandler<DataNode extends NodeModelProperties = NodeModelProperties> implements D3DraggingHandler<DataNode>{

  private currentDragSelection: D3SelectionWrapper;

  private hoveredTargetSelection: D3SelectionWrapper;

  public constructor(
    private parentSelection: D3SelectionWrapper,
    private chartConfig: ChartConfig,
    private getTargetNodes: () => any[],
    private nodeModel: NodeModelFactory) {
  }

  public onDraggingStart(node: DataNode) {
    this.currentDragSelection = this.parentSelection
      .appendGroup()
      .datum<DataNode>(node);

    this.nodeModel.createNodes(this.currentDragSelection);
  }

  public onDragging(draggedNode: DataNode) {
    this.currentDragSelection.transform((node) => `translate(${0}, ${0}), translate(${d3.event.x}, ${d3.event.y})`);

    // if (this.draggingTimeout) {
    //   return;
    // }

    // this.draggingTimeout = setTimeout(() => this.draggingTimeout = null, 100);

    const newHoveredTargetSelection: D3SelectionWrapper | null = this.findHoveredTargetNode(draggedNode);

    if (!newHoveredTargetSelection
      || (this.hoveredTargetSelection && newHoveredTargetSelection.getId() !== this.hoveredTargetSelection.getId())) {

      if (this.hoveredTargetSelection) {
        this.hoveredTargetSelection
          .selectByClass('geometry-element')
          .stroke('#2378ae');
      }

      this.hoveredTargetSelection = newHoveredTargetSelection;
      return;
    }

    this.hoveredTargetSelection = newHoveredTargetSelection;
    this.hoveredTargetSelection
      .selectByClass('geometry-element')
      .stroke('red');
  }

  private findHoveredTargetNode(draggingNode: DataNode): D3SelectionWrapper<d3.BaseType, DataNode, d3.BaseType, DataNode> | null {
    const targetNodes: DataNode[]
      = this.getTargetNodes()
        .filter(targetNode => targetNode.data.dndType === DnDModuleType.DND_TARGET)
        .filter(targetNode => this.isIntersection(this.getTargetNodeSize(targetNode), this.getDraggingNodeSize(draggingNode)));

    if (targetNodes.length === 0) {
      return null;
    }

    return this.parentSelection.selectById(targetNodes[0].data.id);
  }

  private getDraggingNodeSize(draggingNode: DataNode): { top: number; left: number; right: number; bottom: number } {
    const draggingNodeData: NodeDataModelProperties = draggingNode.data;
    const draggingNodeWidth: number = draggingNodeData.width;
    const draggingNodeHeight: number = draggingNodeData.height;

    switch (draggingNodeData.type) {
      case NodeModelType.SECOND_SOURCE:
        return {
          top: d3.event.y - draggingNodeHeight,
          left: d3.event.x - draggingNodeWidth - this.chartConfig.marginLeft,
          right: d3.event.x + draggingNodeWidth - this.chartConfig.marginLeft,
          bottom: d3.event.y + draggingNodeHeight
        };
      default:
        return {
          top: d3.event.y,
          left: d3.event.x - this.chartConfig.marginLeft,
          right: d3.event.x + draggingNodeWidth - this.chartConfig.marginLeft,
          bottom: d3.event.y + draggingNodeHeight
        };
    }
  }

  private getTargetNodeSize(targetNode: any): { top: number; left: number; right: number; bottom: number } {
    const targetNodeHalfHeight: number = targetNode.data.height / 2;

    switch (targetNode.data.type) {
      case NodeModelType.SECOND_SOURCE:
        return {
          top: targetNode.x - targetNode.data.height,
          left: targetNode.y - targetNode.data.width,
          right: targetNode.y + targetNode.data.width,
          bottom: targetNode.x + targetNode.data.height
        };
      default:
        return {
          top: targetNode.x - targetNodeHalfHeight,
          left: targetNode.y,
          right: targetNode.y + targetNode.data.width,
          bottom: targetNode.x + targetNodeHalfHeight
        };
    }
  }

  private isIntersection(first: { top: number, right: number, bottom: number, left: number }, second: { top: number, right: number, bottom: number, left: number }) {
    return !(second.left > first.right ||
      second.right < first.left ||
      second.top > first.bottom ||
      second.bottom < first.top);
  }

  public onDraggingEnd(draggedNode: DataNode) {
    if (this.hoveredTargetSelection) {
      this.hoveredTargetSelection
        .selectByClass('geometry-element')
        .stroke('#2378ae');
      this.hoveredTargetSelection = null;
    }

    const targetSelection: D3SelectionWrapper<d3.BaseType, DataNode, d3.BaseType, DataNode> = this.findHoveredTargetNode(draggedNode);

    if (!targetSelection) {
      this.currentDragSelection.remove();
      this.currentDragSelection = null;
      return;
    }

    /* update group*/
    const draggedNodeData: NodeDataModelProperties = draggedNode.data;
    const targetNode: DataNode = targetSelection.getDatum();

    /* first update properties */
    targetNode.data.width = draggedNodeData.width;
    targetNode.data.height = draggedNodeData.height;
    targetNode.data.rx = draggedNodeData.rx;
    targetNode.data.ry = draggedNodeData.ry;
    targetNode.data.value = draggedNodeData.value;
    targetNode.data.type = draggedNodeData.type;

    /* second update nodes with properties */
    const addNodePathNode: D3SelectionWrapper = targetSelection.select('.add-node-path');

    targetSelection.removeChildren();
    this.nodeModel.createNodes(targetSelection);

    const appendedNode = targetSelection
      .type(draggedNodeData.type)
      .appendSelection(addNodePathNode);

    switch (draggedNodeData.type) {
      case NodeModelType.SECOND_SOURCE:
        appendedNode.transform(`translate(${draggedNodeData.width}, ${-draggedNodeData.height / 2})`);
        targetSelection.transform(node => `translate(${node.y}, ${node.x})`);
        break;
      default:
        appendedNode.transform(`translate(${draggedNodeData.width}, 0)`);
        targetSelection.transform(node => `translate(${node.y}, ${node.x - draggedNodeData.height / 2})`);
    }

    this.currentDragSelection.remove();
    this.currentDragSelection = null;
  }
}
