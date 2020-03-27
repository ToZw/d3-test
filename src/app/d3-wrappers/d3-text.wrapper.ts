import { DnDModule, DnDSourceModule } from '../d3-chart/d3-chart.component';
import { D3SelectionWrapper, D3AttributeValue, D3DnDSelection, D3SelectionType } from './d3-selection.wrapper';

export class D3TextWrapper<DATA extends DnDModule> extends D3SelectionWrapper<DATA> {

  public constructor(selection: D3DnDSelection<DATA>) {
    super(selection);
  }

  public x(x: D3AttributeValue<DATA>): this {
    return this.attr('x', x);
  }

  public y(y: D3AttributeValue<DATA>): this {
    return this.attr('y', y);
  }

  public dx(dx: D3AttributeValue<DATA>): this {
    return this.attr('dx', dx);
  }

  public dy(dy: D3AttributeValue<DATA>): this {
    return this.attr('dy', dy);
  }

  public text(text: D3AttributeValue<DATA>): this {
    this.selection.text(text as any);
    return this;
  }

  public static create<DATA extends DnDModule>(selection: D3DnDSelection<DATA>): D3TextWrapper<DATA> {
    return new D3TextWrapper<DATA>(selection.append(D3SelectionType.TEXT));
  }

  public static createCenteredText<DATA extends DnDSourceModule>(selection: D3DnDSelection<DATA>): D3TextWrapper<DATA> {
    return D3TextWrapper.create(selection)
      .x((data) => data.width / 4)
      .y((data) => data.height / 2)
      .dy('.35em')
      .text((data) => data.value);
  }
}
