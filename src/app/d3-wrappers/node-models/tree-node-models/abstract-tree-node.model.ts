import { NodeModel, NodeModelType } from '../node.model';
import { D3SelectionWrapper } from '../../d3-selection.wrapper';

export abstract class AbstractTreeNodeModel implements NodeModel {

  public abstract readonly type: NodeModelType;

  protected abstract readonly defaultSize: number;

  public constructor() {
  }

  protected prepare(nodeGroups: D3SelectionWrapper): D3SelectionWrapper {
    if (!nodeGroups) {
      throw new Error(`The parameter 'nodeGroups' is required!`);
    }

    nodeGroups.transform((node: d3.HierarchyPointNode<any>) => {
      const halfHeight: number = (node.data.height ? node.data.height : this.defaultSize) / 2;

      return `translate(${node.y}, ${node.x - halfHeight})`
    });

    /* Filter all new groups, so old groups won't be appended multiple times */
    const newGroups: D3SelectionWrapper = nodeGroups.filterEmptyGroups();

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

  abstract createNodes(nodeGroups: D3SelectionWrapper): void;
}
