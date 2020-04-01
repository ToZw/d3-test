import { D3TreeWrapper } from '../d3-tree.wrapper';
import { D3SelectionTest } from '../d3-selection-test';

export interface NodeModel {
  createNodes(d3TreeWrapper: D3TreeWrapper, nodeGroups: D3SelectionTest): void;
}

export enum NodeModelType {
  SOURCE = 'source',
  TARGET = 'target',
  TESTO = 'testo'
}

export abstract class AbstractNodeModel implements NodeModel {

  protected abstract readonly defaultSize: number;

  protected prepare(d3TreeWrapper: D3TreeWrapper, nodeGroups: D3SelectionTest): D3SelectionTest {
    if (!d3TreeWrapper) {
      throw new Error(`The parameter 'd3TreeWrapper' is required!`);
    }

    if (!nodeGroups) {
      throw new Error(`The parameter 'nodeGroups' is required!`);
    }

    nodeGroups.transform((node: d3.HierarchyPointNode<any>) => {
      const halfHeight = (node.data.height ? node.data.height : this.defaultSize) / 2;

      return `translate(${node.y}, ${node.x - halfHeight})`
    });

    /* Filter all new groups, so old groups won't be appended multiple times */
    const newGroups: D3SelectionTest = nodeGroups.filterEmptyGroups();

    newGroups.getData().forEach(node => {
      node.data.width = this.defaultSize;
      node.data.height = this.defaultSize;
    });

    return newGroups;
  }

  protected createChildId(node: d3.HierarchyPointNode<any>): string {
    const data = node.data;
    const size = data.children ? data.children.length : 0;

    // return data.id + '_' + Number.parseInt((Math.random() * 10000).toString()) ;
    return data.id + '_' + size;
  }

  abstract createNodes(d3TreeWrapper: D3TreeWrapper, nodeGroups: D3SelectionTest): void;
}
