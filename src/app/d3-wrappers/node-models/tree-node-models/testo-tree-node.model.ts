import * as d3 from "d3";
import { D3SelectionWrapper } from '../../d3-selection.wrapper';
import { D3TreeWrapper } from '../../d3-tree.wrapper';
import { NodeModelType } from '../node.model';
import { DnDModuleType } from 'src/app/d3-chart/d3-chart.component';
import { AbstractTreeNodeModel } from './abstract-tree-node.model';

export class TestoTreeNodeModel extends AbstractTreeNodeModel {

  public readonly type: NodeModelType = NodeModelType.TESTO;

  protected readonly defaultSize: number = 100;

  public constructor(private d3TreeWrapper: D3TreeWrapper) {
    super();

    if (!this.d3TreeWrapper) {
      throw new Error(`The parameter 'd3TreeWrapper' is required!, ${this.d3TreeWrapper}`);
    }
  }

  public createNodes(nodeGroups: D3SelectionWrapper): void {
    const newGroups: D3SelectionWrapper = this.prepare(nodeGroups);

    newGroups
      .appendRect()
      .width(this.defaultSize)
      .height(this.defaultSize)
      .fill('white')
      .stroke('yellow')
      .strokeDasharray('10,5')
      .strokeLinecap('butt')
      .strokeWidth('3');

    newGroups
      .appendText()
      .centerTextInRect({ rectWidth: this.defaultSize, rectHeight: this.defaultSize })
      .text('Drag here');
    // .text(node => node.data.id);

    newGroups
      .appendPath()
      .setSymbol(
        d3.symbol()
          .size(300)
          .type(d3.symbolCross))
      .transform(`translate(${this.defaultSize}, 0)`)
      .cursor('pointer')
      .onClick((node: d3.HierarchyPointNode<any>) => {
        const newId = this.createChildId(node);

        this.d3TreeWrapper.addNode(
          node,
          {
            type: 'testo',
            dndType: DnDModuleType.DND_TARGET,
            id: newId,
            name: newId
          })
      });
  }
}
