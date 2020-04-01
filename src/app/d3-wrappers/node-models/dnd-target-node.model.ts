import * as d3 from "d3";
import { D3SelectionTest } from '../d3-selection-test';
import { D3TreeWrapper } from '../d3-tree.wrapper';
import { AbstractNodeModel } from './node.model';
import { DnDModuleType } from 'src/app/d3-chart/d3-chart.component';

export class DnDTargetNodeModel extends AbstractNodeModel {

  protected readonly defaultSize: number = 50;

  public createNodes(d3TreeWrapper: D3TreeWrapper, nodeGroups: D3SelectionTest): void {
    const newGroups: D3SelectionTest = this.prepare(d3TreeWrapper, nodeGroups);

    newGroups
      .appendRect()
      .width(this.defaultSize)
      .height(this.defaultSize)
      .fill('white')
      .stroke('#2378ae')
      .strokeDasharray('10,5')
      .strokeLinecap('butt')
      .strokeWidth('3');

    newGroups
      .appendText()
      .centerTextInRect({ rectWidth: this.defaultSize, rectHeight: this.defaultSize })
      // .text('Drag here');
      .text(node => {
        console.log('id', node.data.id);
        return node.data.id
      });

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

        d3TreeWrapper.addNode(
          node,
          {
            type: 'target',
            dndType: DnDModuleType.DND_TARGET,
            id: newId,
            name: newId
          })
      });
  }
}
