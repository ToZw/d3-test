import { NodeModelFactory, NodeModelType, NodeModelSize } from '../../models/node.model';
import { D3SelectionWrapper } from '../../../d3-wrappers/d3-selection.wrapper';

export abstract class AbstractTreeNodeModelFactory implements NodeModelFactory {

  public abstract readonly type: NodeModelType;

  public abstract readonly creationType: NodeModelType;

  public abstract readonly defaultSize: NodeModelSize;

  public constructor() {
  }

  protected prepare(nodeGroups: D3SelectionWrapper): D3SelectionWrapper {
    if (!nodeGroups) {
      throw new Error(`The parameter 'nodeGroups' is required!`);
    }

    nodeGroups.transform((node: d3.HierarchyPointNode<any>) => {
      const halfHeight: number = (node.data.height ? node.data.height : this.defaultSize.height) / 2;

      return `translate(${node.y}, ${node.x - halfHeight})`
    });

    /* Filter all new groups, so old groups won't be appended multiple times */
    const newGroups: D3SelectionWrapper = nodeGroups.filterEmptyGroups();

    newGroups.getData().forEach(node => {
      node.data.width = this.defaultSize.width;
      node.data.height = this.defaultSize.height;
    });

    return newGroups;
  }

  abstract createNodes(nodeGroups: D3SelectionWrapper): D3SelectionWrapper;
}
