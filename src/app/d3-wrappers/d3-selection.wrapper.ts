import { DnDModule } from '../d3-chart/d3-chart.component';

export abstract class D3SelectionWrapper<DATA extends DnDModule = DnDModule> {

  protected selection: D3DnDSelection<DATA>;

  public constructor(selection: D3DnDSelection<DATA>) {
    this.selection = selection;
  }

  public getSelection(): D3DnDSelection<DATA> {
    return this.selection;
  }

  public getId(): string {
    return this.selection.attr('id');
  }

  public id(value: string | null): this {
    return this.attr('id', value);
  }

  public transform(transform: D3AttributeValue): this {
    return this.attr('transform', transform);
  }

  public datum(datum: DATA): this {
    this.selection.datum(datum);
    return this;
  }

  public remove(): this {
    this.selection = this.selection.remove();
    return this;
  }

  protected attr(name: string, value: D3AttributeValue<DATA>): this {
    this.selection.attr(name, value as any);
    return this;
  }

  protected onClick(clickFunction: d3.ValueFn<any, DATA, void>, capture?: boolean): this {
    this.selection.on('click', clickFunction, capture);
    return this;
  }
}

export type D3DnDSelection<DATA = DnDModule> = d3.Selection<SVGGElement, DATA, d3.BaseType, any>;

export type D3AttributeValue<DATA = DnDModule> = d3.ValueFn<any, DATA, string | number | boolean | null> | string | number | boolean | null;

export enum D3SelectionType {
  GROUP = 'g',
  RECT = 'rect',
  TEXT = 'text',
  PATH = 'path'
}
