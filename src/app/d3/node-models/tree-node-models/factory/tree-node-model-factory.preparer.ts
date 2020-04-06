import { NodeModelFactoryPreparer, NodeModelSize } from '../../models/node.model';
import { D3SelectionWrapper } from '../../../d3-wrappers/d3-selection.wrapper';

export class TreeNodeModelFactoryPreparer implements NodeModelFactoryPreparer {

  public constructor() {
  }

  public prepare(nodeGroups: D3SelectionWrapper, defaultSize: NodeModelSize): D3SelectionWrapper {
    if (!nodeGroups) {
      throw new Error(`The parameter 'nodeGroups' is required!`);
    }

    nodeGroups.transform((node: d3.HierarchyPointNode<any>) => {
      const halfHeight: number = (node.data.height ? node.data.height : defaultSize.height) / 2;

      return `translate(${node.y}, ${node.x - halfHeight})`
    });

    /* Filter all new groups, so old groups won't be appended multiple times */
    const newGroups: D3SelectionWrapper = nodeGroups.filterEmptyGroups();

    newGroups.getData().forEach(node => {
      node.data.width = defaultSize.width;
      node.data.height = defaultSize.height;
    });

    return newGroups;
  }
}
