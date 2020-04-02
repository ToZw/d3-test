import { D3SelectionWrapper } from '../d3-selection.wrapper';

export interface NodeModel {
  readonly type: NodeModelType;
  createNodes(nodeGroups: D3SelectionWrapper): void;
}

export enum NodeModelType {
  SOURCE = 'source',
  TARGET = 'target',
  TESTO = 'testo'
}
