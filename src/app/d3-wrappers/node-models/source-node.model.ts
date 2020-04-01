import * as d3 from "d3";
import { D3SelectionTest } from '../d3-selection-test';
import { D3TreeWrapper } from '../d3-tree.wrapper';
import { AbstractNodeModel } from './node.model';

export class SourceNodeModel extends AbstractNodeModel {

  protected readonly defaultSize: number = 50;

  public createNodes(d3TreeWrapper: D3TreeWrapper, nodeGroups: D3SelectionTest): void {
    const newGroups: D3SelectionTest = this.prepare(d3TreeWrapper, nodeGroups);

    newGroups
      .appendRect()
      .width(this.defaultSize)
      .height(this.defaultSize)
      .fill('white')
      .setSolidBorder();

    newGroups
      .appendText()
      .centerTextInRect({ rectWidth: this.defaultSize, rectHeight: this.defaultSize })
      .text((node) => node.data.value);
  }
}
