import { D3SelectionWrapper } from '../../d3-wrappers/d3-selection.wrapper';
import { DnDModuleType } from 'src/app/d3-chart/d3-chart.component';

export interface NodeModelFactory {
  readonly type: NodeModelType;
  readonly creationType: NodeModelType;
  readonly defaultSize: NodeModelSize;
  createNodes(nodeGroups: D3SelectionWrapper): D3SelectionWrapper;
}

export abstract class AbstractNodeModelFactory implements NodeModelFactory {
  abstract readonly type: NodeModelType;
  abstract readonly creationType: NodeModelType;
  abstract readonly defaultSize: NodeModelSize;

  private nodeModelFactoryPreparer: NodeModelFactoryPreparer = new NoOpNodeModelFactoryPreparer();

  public constructor(nodeModelFactoryPreparer: NodeModelFactoryPreparer) {
    if (!nodeModelFactoryPreparer) {
      return;
    }

    this.nodeModelFactoryPreparer = nodeModelFactoryPreparer;
  }

  public createNodes(nodeGroups: D3SelectionWrapper): D3SelectionWrapper {
    if (!nodeGroups) {
      throw new Error(`The parameter 'nodeGroups' is required!, ${nodeGroups}`);
    }

    return this.nodeModelFactoryPreparer.prepare(nodeGroups, this.defaultSize);
  };
}

export interface NodeModelFactoryPreparer {
  prepare(nodeGroups: D3SelectionWrapper, defaultSize: NodeModelSize): D3SelectionWrapper;
}

export class NoOpNodeModelFactoryPreparer implements NodeModelFactoryPreparer {
  public prepare(nodeGroups: D3SelectionWrapper, defaultSize: NodeModelSize): D3SelectionWrapper {
    return nodeGroups;
  };
}

export class SimpleNodeModelFactoryPreparer implements NodeModelFactoryPreparer {
  public prepare(nodeGroups: D3SelectionWrapper, defaultSize: NodeModelSize): D3SelectionWrapper {
    nodeGroups.transform((node: NodeModelProperties) => `translate(${node.x}, ${node.y})`);

    /* Filter all new groups, so old groups won't be appended multiple times */
    return nodeGroups.filterEmptyGroups();
  };
}

export interface NodeModelProperties {
  data: NodeDataModelProperties,
  x: number;
  y: number;
}

export interface NodeDataModelProperties {
  id: string;
  type: NodeModelType;
  dndType: DnDModuleType;
  width: number;
  height: number;
  [key: string]: any;
}

export enum NodeModelType {
  SOURCE = 'source',
  SECOND_SOURCE = 'secondSource',
  TARGET = 'target',
  TESTO = 'testo'
}

export interface NodeModelSize {
  width: number;
  height: number;
}
