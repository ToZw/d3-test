import { D3GroupWrapper } from '../d3-group.wrapper';
import { DnDModule } from 'src/app/d3-chart/d3-chart.component';

export interface DnDModuleModel<DATA extends DnDModule = DnDModule> {

  build(...parameters: any): this

  getGroup(): D3GroupWrapper<DATA>;
}
