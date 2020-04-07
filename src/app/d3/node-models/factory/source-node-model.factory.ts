import * as d3 from "d3";
import { D3SelectionWrapper } from '../../d3-wrappers/d3-selection.wrapper';
import { NodeModelType, AbstractNodeModelFactory, NodeModelFactoryPreparer, NodeModelSize } from '../models/node.model';
import { ChartSourceNodeModel } from '../models/chart-source-node.model';

export class SourceNodeModelFactory extends AbstractNodeModelFactory {

  public readonly type: NodeModelType = NodeModelType.SOURCE;

  public readonly creationType: NodeModelType = NodeModelType.TARGET;

  public readonly defaultSize: NodeModelSize = { width: 100, height: 50 };

  public constructor(nodeModelFactoryPreparer?: NodeModelFactoryPreparer) {
    super(nodeModelFactoryPreparer);
  }

  public createNodes(nodeGroups: D3SelectionWrapper<d3.BaseType, ChartSourceNodeModel, d3.BaseType, ChartSourceNodeModel>): D3SelectionWrapper {
    const newGroups: D3SelectionWrapper = super.createNodes(nodeGroups);

    newGroups
      .appendRect()
      .classed('geometry-element', true)
      .width(this.defaultSize.width)
      .height(this.defaultSize.height)
      .fill('white')
      .setSolidBorder();

    newGroups
      .appendText()
      .centerTextInRect(this.defaultSize)
      .dy('0.1em')
      .text((node) => node.data.value)
      .fitText(this.defaultSize.width);

    return newGroups;
  }
}
