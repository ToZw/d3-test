import * as d3 from "d3";
import { DnDModuleType } from '../../d3-chart/d3-chart.component';
import { D3SelectionWrapper } from '../d3-wrappers/d3-selection.wrapper';
import { NodeModelFactory, NodeModelProperties } from '../node-models/models/node.model';
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

    const newHoveredTargetSelection: D3SelectionWrapper | null = this.findHoveredTargetModule(draggedNode);

    if (!newHoveredTargetSelection
      || (this.hoveredTargetSelection && newHoveredTargetSelection.getId() !== this.hoveredTargetSelection.getId())) {

      if (this.hoveredTargetSelection) {
        this.hoveredTargetSelection
          .selectFirstRect()
          .stroke('#2378ae');
      }

      this.hoveredTargetSelection = newHoveredTargetSelection;
      return;
    }

    this.hoveredTargetSelection = newHoveredTargetSelection;
    this.hoveredTargetSelection
      .selectFirstRect()
      .stroke('red');
  }

  private findHoveredTargetModule(node: DataNode): D3SelectionWrapper<d3.BaseType, DataNode, d3.BaseType, DataNode> | null {
    const targetNodes: DataNode[]
      = this.getTargetNodes()
        .filter(targetNode => targetNode.data.dndType === DnDModuleType.DND_TARGET)
        .filter(
          targetNode => {
            const moduleHalfHeight: number = targetNode.data.height / 2;
            const draggingModule = {
              top: d3.event.y,
              left: d3.event.x - this.chartConfig.marginLeft,
              right: d3.event.x + node.data.width - this.chartConfig.marginLeft,
              bottom: d3.event.y + node.data.height
            };
            const targetModule = {
              top: targetNode.x - moduleHalfHeight,
              left: targetNode.y,
              right: targetNode.y + targetNode.data.width,
              bottom: targetNode.x + moduleHalfHeight
            };

            return this.isIntersection(targetModule, draggingModule);
          });

    if (targetNodes.length === 0) {
      return null;
    }

    return this.parentSelection.select(`#${targetNodes[0].data.id}`);
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
        .selectFirstRect()
        .stroke('#2378ae');
      this.hoveredTargetSelection = null;
    }

    const targetSelection: D3SelectionWrapper<d3.BaseType, DataNode, d3.BaseType, DataNode> = this.findHoveredTargetModule(draggedNode);

    if (!targetSelection) {
      this.currentDragSelection.remove();
      this.currentDragSelection = null;
      return;
    }

    /* update group*/
    targetSelection.transform(node => `translate(${node.y}, ${node.x - draggedNode.data.height / 2})`);

    const targetNode: DataNode = targetSelection.getDatum();

    targetNode.data.width = draggedNode.data.width;
    targetNode.data.height = draggedNode.data.height;

    /* update rect */
    targetSelection
      .selectFirstRect()
      .width(draggedNode.data.width)
      .height(draggedNode.data.height)
      .fill('white')
      .setSolidBorder();

    /* update text */
    targetSelection
      .selectFirstText()
      .centerTextInRect({ rectWidth: draggedNode.data.width, rectHeight: draggedNode.data.height })
      .text(draggedNode.data.value);

    /* update add-button */
    targetSelection
      .selectFirstPath()
      .transform(`translate(${draggedNode.data.width}, 0)`);

    this.currentDragSelection.remove();
    this.currentDragSelection = null;
  }
}
