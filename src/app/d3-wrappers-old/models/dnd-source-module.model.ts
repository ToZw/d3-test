import { DnDSourceModule } from '../../d3-chart/d3-chart.component';
import { D3Selection } from '../d3-selection.wrapper';
import { D3RectWrapper } from '../d3-rect.wrapper';
import { D3TextWrapper } from '../d3-text.wrapper';
import { DnDModuleModel } from './dnd-module.model';
import { D3GroupWrapper } from '../d3-group.wrapper';

export class DnDSourceModuleModel<DATA extends DnDSourceModule = DnDSourceModule> implements DnDModuleModel {

  private group: D3GroupWrapper<DATA>;

  public constructor(selection: D3Selection<DATA>) {
    this.group = new D3GroupWrapper(selection);
  }

  public build(): this {
    const selection: D3Selection<DATA> = this.group.getSelection();

    D3RectWrapper.create(selection)
      .width(data => data.width)
      .height(data => data.height)
      .fill('white')
      .setSolidBorder();
    D3TextWrapper.createCenteredText(selection);
    return this;
  }

  public getGroup(): D3GroupWrapper<DATA> {
    return this.group;
  }
}
