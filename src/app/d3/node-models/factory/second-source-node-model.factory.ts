import * as d3 from "d3";
import { D3SelectionWrapper } from '../../d3-wrappers/d3-selection.wrapper';
import { NodeModelType, AbstractNodeModelFactory, NodeModelFactoryPreparer, NodeModelSize } from '../models/node.model';
import { ChartSourceNodeModel } from '../models/chart-source-node.model';

export class SecondSourceNodeModelFactory extends AbstractNodeModelFactory {

  public readonly type: NodeModelType = NodeModelType.SECOND_SOURCE;

  public readonly creationType: NodeModelType = NodeModelType.TARGET;

  public readonly defaultSize: NodeModelSize = { width: 100, height: 50 };

  public constructor(nodeModelFactoryPreparer?: NodeModelFactoryPreparer) {
    super(nodeModelFactoryPreparer);
  }

  public createNodes(nodeGroups: D3SelectionWrapper<d3.BaseType, ChartSourceNodeModel, d3.BaseType, ChartSourceNodeModel>): D3SelectionWrapper {
    const newGroups: D3SelectionWrapper = super.createNodes(nodeGroups);

    const halfWidth: number = this.defaultSize.width / 2;
    const halfHeight: number = this.defaultSize.height / 2;

    nodeGroups.each((nodeModel: ChartSourceNodeModel) => {
      nodeModel.data.cx = halfWidth;
      nodeModel.data.rx = halfWidth;
      nodeModel.data.ry = halfHeight;
    });

    newGroups
      .appendEllipse()
      .classed('geometry-element', true)
      .cx(halfWidth)
      .cy(0)
      .rx(halfWidth)
      .ry(halfHeight)
      .fill('yellow')
      .stroke('blue')
      .strokeWidth('2');

    newGroups
      .appendText()
      .centerTextInCircle(this.defaultSize)
      .text((node) => node.data.value);

    return newGroups;
  }
}
