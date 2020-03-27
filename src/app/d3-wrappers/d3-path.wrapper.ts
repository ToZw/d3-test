import { symbol, symbolCross } from "d3";
import { DnDModule } from '../d3-chart/d3-chart.component';
import { D3SelectionWrapper } from './d3-selection.wrapper';

export class D3PathWrapper<DATA extends DnDModule> extends D3SelectionWrapper<DATA> {

  public constructor(selection: d3.Selection<SVGGElement, DATA, d3.BaseType, any>) {
    super(selection);
  }

  public d(symbol: d3.Symbol<any, any>): this {
    return this.attr('d', symbol);
  }

  public onClick(clickFunction: d3.ValueFn<any, DATA, void>, capture?: boolean): this {
    return super.onClick(clickFunction);
  }

  public static create<DATA extends DnDModule>(selection: d3.Selection<SVGGElement, DATA, d3.BaseType, any>): D3PathWrapper<DATA> {
    return new D3PathWrapper<DATA>(selection.append('path'));
  }

  public static createCrossSymbol<DATA extends DnDModule>(selection: d3.Selection<SVGGElement, DATA, d3.BaseType, any>): D3PathWrapper<DATA> {
    return D3PathWrapper.create(selection)
      .d(
        symbol()
          .size(300)
          .type(symbolCross));
  }
}
