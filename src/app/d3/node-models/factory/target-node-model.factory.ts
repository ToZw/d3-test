import * as d3 from "d3";
import { D3SelectionWrapper } from '../../d3-wrappers/d3-selection.wrapper';
import { NodeModelType, NodeModelFactoryPreparer, AbstractNodeModelFactory, NodeModelSize } from '../models/node.model';

export class TargetNodeModelFactory extends AbstractNodeModelFactory {

  public readonly type: NodeModelType = NodeModelType.TARGET;

  public readonly creationType: NodeModelType = NodeModelType.TARGET;

  public readonly defaultSize: NodeModelSize = { width: 50, height: 50 };

  public constructor(nodeModelFactoryPreparer?: NodeModelFactoryPreparer) {
    super(nodeModelFactoryPreparer);
  }

  public createNodes(nodeGroups: D3SelectionWrapper): D3SelectionWrapper {
    const newGroups: D3SelectionWrapper = super.createNodes(nodeGroups);

    newGroups
      .appendRect()
      .classed('geometry-element', true)
      .width(this.defaultSize.width)
      .height(this.defaultSize.height)
      .fill('white')
      .stroke('#2378ae')
      .strokeDasharray('10,5')
      .strokeLinecap('butt')
      .strokeWidth('3');

    newGroups
      .appendText()
      .centerTextInRect(this.defaultSize)
      // .text('Drag here');
      .text(node => node.data.id);

    return newGroups;
  }
}
