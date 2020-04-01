import { DnDTargetModule } from '../../d3-chart/d3-chart.component';
import { D3Selection } from '../d3-selection.wrapper';
import { D3RectWrapper } from '../d3-rect.wrapper';
import { D3TextWrapper } from '../d3-text.wrapper';
import { D3PathWrapper } from '../d3-path.wrapper';
import { D3GroupWrapper } from '../d3-group.wrapper';
import { DnDModuleModel } from './dnd-module.model';

export class DnDTargetModuleModel<DATA extends DnDTargetModule = DnDTargetModule> implements DnDModuleModel {

  private readonly defaultWidth: number = 25;

  private group: D3GroupWrapper<DATA>;

  public constructor(selection: D3Selection<DATA>) {
    this.group = new D3GroupWrapper(selection);
  }

  public build(
    addRight?: d3.ValueFn<any, DATA, void>,
    addBottom?: d3.ValueFn<any, DATA, void>): this {

    const selection: D3Selection<DATA> = this.group.getSelection();

    D3RectWrapper.create(selection)
      .width(data => data.width ? data.width : this.defaultWidth)
      .height(data => data.height ? data.height : this.defaultWidth)
      .fill('white')
      .stroke('#2378ae')
      .strokeDasharray('10,5')
      .strokeLinecap('butt')
      .strokeWidth('3');

    D3TextWrapper.create(selection)
      .x((data) => (data.width ? data.width : this.defaultWidth) / 4)
      .y((data) => (data.height ? data.height : this.defaultWidth) / 2)
      .dy('.35em')
      .text('Drag here');

    if (addRight) {
      D3PathWrapper.createCrossSymbol(selection)
        .transform((data) => `translate(${data.width + 25}, ${data.height / 2})`)
        .onClick(addRight);
    }

    if (addBottom) {
      D3PathWrapper.createCrossSymbol(selection)
        .transform((data) => `translate(${data.width / 2}, ${data.height + 25})`)
        .onClick(addBottom);
    }

    return this;
  }

  public getGroup(): D3GroupWrapper<DATA> {
    return this.group;
  }
}
