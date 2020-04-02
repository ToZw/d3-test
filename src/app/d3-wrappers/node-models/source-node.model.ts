import * as d3 from "d3";
import { D3SelectionWrapper } from '../d3-selection.wrapper';
import { NodeModelType, NodeModel } from './node.model';
import { D3DraggingHandler } from 'src/app/drag-and-drop/d3-drag-and-drop-handler';

export class SourceNodeModel implements NodeModel {

  public readonly type: NodeModelType = NodeModelType.SOURCE;

  public constructor(private draggingHandler?: D3DraggingHandler<any>) {
  }

  public createNodes(nodeGroups: D3SelectionWrapper): void {
    if (!nodeGroups) {
      throw new Error(`The parameter 'nodeGroups' is required!, ${nodeGroups}`);
    }

    nodeGroups.transform((node: d3.HierarchyPointNode<any>) => `translate(${node.x}, ${node.y})`);

    /* Filter all new groups, so old groups won't be appended multiple times */
    const newGroups: D3SelectionWrapper = nodeGroups.filterEmptyGroups();

    newGroups
      .appendRect()
      .width(node => node.data.width)
      .height(node => node.data.height)
      .fill('white')
      .setSolidBorder();

    newGroups
      .appendText()
      .centerTextInRect()
      .text((node) => node.data.value);

    if (this.draggingHandler) {
      newGroups.cursor('pointer');
      newGroups.call(
        d3.drag()
          .on('start', this.draggingHandler.onDraggingStart.bind(this.draggingHandler))
          .on('drag', this.draggingHandler.onDragging.bind(this.draggingHandler))
          .on('end', this.draggingHandler.onDraggingEnd.bind(this.draggingHandler))
      );
    }
  }
}
