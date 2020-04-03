import { NodeDataModelProperties } from '../../models/node.model';


export interface ChartTreeNodeDataModelProperties extends NodeDataModelProperties {
  name?: string;
  value?: string | number | boolean | null;
  children?: ChartTreeNodeDataModelProperties[];
}
