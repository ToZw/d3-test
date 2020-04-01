import { symbol, symbolCross } from "d3";
import { D3SelectionWrapper, D3SelectionType } from './d3-selection.wrapper';

export class D3PathWrapper<DATA> extends D3SelectionWrapper<DATA> {

  public constructor(selection: d3.Selection<SVGGElement, DATA, d3.BaseType, any>) {
    super(selection);
  }

  public d(commands: any): this {
    return this.attr('d', commands);
  }

  public setSymbol(symbol: d3.Symbol<any, any>): this {
    return this.attr('d', symbol);
  }

  // @Override
  public selectAll(selector: string | d3.ValueFn<any, DATA, any[] | ArrayLike<any>> | null): D3PathWrapper<DATA> | null {
    return new D3PathWrapper<DATA>(super.selectAll(selector).getSelection());
  }

  public static create<DATA>(selection: d3.Selection<SVGGElement, DATA, d3.BaseType, any>): D3PathWrapper<DATA> {
    return new D3PathWrapper<DATA>(selection.append(D3SelectionType.PATH));
  }

  public static createCrossSymbol<DATA>(selection: d3.Selection<SVGGElement, DATA, d3.BaseType, any>): D3PathWrapper<DATA> {
    return D3PathWrapper.create(selection)
      .setSymbol(
        symbol()
          .size(300)
          .type(symbolCross));
  }
}
