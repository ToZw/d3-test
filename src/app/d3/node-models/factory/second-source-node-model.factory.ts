import * as d3 from "d3";
import { D3SelectionWrapper } from '../../d3-wrappers/d3-selection.wrapper';
import { NodeModelType, AbstractNodeModelFactory, NodeModelFactoryPreparer, NodeModelSize } from '../models/node.model';
import { ChartSourceNodeModel } from '../models/chart-source-node.model';

export class SecondSourceNodeModelFactory extends AbstractNodeModelFactory {

  public readonly type: NodeModelType = NodeModelType.SECOND_SOURCE;

  public readonly creationType: NodeModelType = NodeModelType.TARGET;

  public readonly defaultSize: NodeModelSize = { width: 50, height: 25 };

  public constructor(nodeModelFactoryPreparer?: NodeModelFactoryPreparer) {
    super(nodeModelFactoryPreparer);
  }

  public createNodes(nodeGroups: D3SelectionWrapper<d3.BaseType, ChartSourceNodeModel, d3.BaseType, ChartSourceNodeModel>): D3SelectionWrapper {
    const newGroups: D3SelectionWrapper = super.createNodes(nodeGroups);

    newGroups
      .appendEllipse()
      .classed('geometry-element', true)
      .cx(node => node.data.cx ? node.data.cx : 0)
      .cy(node => node.data.cy ? node.data.cy : 0)
      .rx(this.defaultSize.width)
      .ry(this.defaultSize.height)
      .fill('yellow')
      .stroke('blue')
      .strokeWidth('2');

    newGroups
      .appendText()
      .centerTextInCircle()
      .text((node) => node.data.value);

    return newGroups;
  }
}
