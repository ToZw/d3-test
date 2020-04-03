import { DnDModuleType } from 'src/app/d3-chart/d3-chart.component';
import { NodeModelType, NodeModelProperties } from './node.model';

export interface ChartSourceNodeModel extends NodeModelProperties {
  data: {
    id: string;
    type: NodeModelType;
    dndType: DnDModuleType;
    width: number;
    height: number;
    value: string | number | boolean | null;
    [key: string]: any;
  }
}
