import { D3SelectionWrapper } from '../../d3-wrappers/d3-selection.wrapper';
import { DnDModuleType } from 'src/app/d3-chart/d3-chart.component';

export interface NodeModelFactory {
  readonly type: NodeModelType;
  createNodes(nodeGroups: D3SelectionWrapper): void;
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
  TARGET = 'target',
  TESTO = 'testo'
}
