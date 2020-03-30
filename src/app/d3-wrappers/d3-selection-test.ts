import * as d3 from "d3";

export class D3SelectionTest {

  protected selection: D3Selection;

  public constructor(selection: D3Selection) {
    this.selection = selection;

    // console.log((this.selection as any)._groups);
  }

  public getSelection(): D3Selection {
    return this.selection;
  }

  public getId(): string {
    return this.selection.attr('id');
  }

  public id(value: D3AttributeValue): this {
    return this.attr('id', value);
  }

  public transform(transform: D3AttributeValue): this {
    return this.attr('transform', transform);
  }

  public datum<NEWDATA>(datum: NEWDATA): D3SelectionTest {
    return new D3SelectionTest(this.selection.datum<NEWDATA>(datum));
  }

  public data<NEWDATA>(data: NEWDATA[] | d3.ValueFn<any, any, NEWDATA[]>, key?: d3.ValueFn<any, any, string>): D3SelectionTest {
    return new D3SelectionTest(this.selection.data<NEWDATA>(data as any, key));
  }

  public filter(filter: D3AttributeValue): D3SelectionTest {
    return new D3SelectionTest(this.selection.filter(filter as any));
  }

  public enter(): D3SelectionTest {
    return new D3SelectionTest(this.selection.enter());
  }

  public exit<OldDatum>(): D3SelectionTest {
    return new D3SelectionTest(this.selection.exit());
  }

  public join(
    enter: any,
    update?: (elem: D3Selection) => D3Selection | undefined,
    exit?: (elem: D3Selection) => void): D3SelectionTest {

    return new D3SelectionTest(this.selection.join(enter, update, exit));
  }

  public remove(): this {
    this.selection = this.selection.remove();
    return this;
  }

  public clone(deep?: boolean): D3SelectionTest {
    return new D3SelectionTest(this.selection.clone(deep));
  }

  public lower(): this {
    this.selection.lower();
    return this;
  }

  public selectFirstRect(): D3SelectionTest {
    return this.select(D3SelectionType.RECT);
  }

  public selectFirstText(): D3SelectionTest {
    return this.select(D3SelectionType.TEXT);
  }

  public select(selector: string | d3.ValueFn<any, any, any> | null): D3SelectionTest {
    return new D3SelectionTest(this.selection.select(selector as any));
  }

  public selectAll(selector: string | d3.ValueFn<any, any, any[] | ArrayLike<any>> | null): D3SelectionTest {
    return new D3SelectionTest(this.selection.selectAll(selector as any));
  }

  public type(type: D3AttributeValue): this {
    return this.attr('type', type);
  }

  public width(width: D3AttributeValue): this {
    return this.attr('width', width);
  }

  public height(height: D3AttributeValue): this {
    return this.attr('height', height);
  }

  public fill(color: D3AttributeValue): this {
    return this.attr('fill', color);
  }

  public stroke(color: D3AttributeValue): this {
    return this.attr('stroke', color);
  }

  public strokeOpacity(opacity: D3AttributeValue): this {
    return this.attr('stroke-opacity', opacity);
  }

  public strokeDasharray(dashArray: D3AttributeValue): this {
    return this.attr('stroke-dasharray', dashArray);
  }

  public strokeLinecap(lineCap: D3AttributeValue): this {
    return this.attr('stroke-linecap', lineCap);
  }

  public strokeLinejoin(strokeLinejoin: D3AttributeValue): this {
    return this.attr('stroke-linejoin', strokeLinejoin);
  }

  public strokeWidth(width: D3AttributeValue): this {
    return this.attr('stroke-width', width);
  }

  public setSolidBorder(): this {
    return this.stroke('#2378ae')
      .strokeDasharray('unset')
      .strokeLinecap('butt')
      .strokeWidth('3');
  }

  public setDashedBorder(): this {
    return this.stroke('#2378ae')
      .strokeDasharray('10.5')
      .strokeLinecap('butt')
      .strokeWidth('3');
  }

  public fontFamily(fontFamily: D3AttributeValue): this {
    return this.attr("font-family", fontFamily);
  }

  public fontSize(fontSize: D3AttributeValue): this {
    return this.attr("font-size", fontSize);
  }

  public radius(radius: D3AttributeValue): this {
    return this.attr('r', radius);
  }

  public x(x: D3AttributeValue): this {
    return this.attr('x', x);
  }

  public y(y: D3AttributeValue): this {
    return this.attr('y', y);
  }

  public dx(dx: D3AttributeValue): this {
    return this.attr('dx', dx);
  }

  public dy(dy: D3AttributeValue): this {
    return this.attr('dy', dy);
  }

  public text(text: D3AttributeValue): this {
    this.selection.text(text as any);
    return this;
  }

  public textAnchor(textAnchor: D3AttributeValue): this {
    return this.attr('text-anchor', textAnchor);
  }

  public viewBox(viewBox: D3AttributeValue): this {
    return this.attr('viewBox', viewBox);
  }

  public d(commands: any): this {
    return this.attr('d', commands);
  }

  public setSymbol(symbol: d3.Symbol<any, any>): this {
    return this.attr('d', symbol);
  }

  protected attr(name: string, value: D3AttributeValue): this {
    this.selection.attr(name, value as any);
    return this;
  }

  public onClick(clickFunction: d3.ValueFn<any, any, void>, capture?: boolean): this {
    this.selection.on('click', clickFunction, capture);
    return this;
  }

  public call(func: (selection: D3Selection, ...args: any[]) => void, ...args: any[]): this {
    this.selection.call(func);
    return this;
  }

  public appendSVG(): D3SelectionTest {
    return this.append(D3SelectionType.SVG);
  }

  public appendGroup(): D3SelectionTest {
    return this.append(D3SelectionType.GROUP);
  }

  public appendRect(): D3SelectionTest {
    return this.append(D3SelectionType.RECT);
  }

  public appendCircle(): D3SelectionTest {
    return this.append(D3SelectionType.CIRCLE);
  }

  public appendText(): D3SelectionTest {
    return this.append(D3SelectionType.TEXT);
  }

  public appendPath(): D3SelectionTest {
    return this.append(D3SelectionType.PATH);
  }

  private append(type: D3SelectionType): D3SelectionTest {
    return new D3SelectionTest(this.selection.append(type));
  }

  public static select(selector: string | d3.ValueFn<any, any, any> | null): D3SelectionTest {
    return new D3SelectionTest(d3.select(selector as any));
  }

  public static selectAll(selector: string | d3.ValueFn<any, any, any[] | ArrayLike<any>> | null): D3SelectionTest {
    return new D3SelectionTest(d3.selectAll(selector as any));
  }
}

export type D3Selection<DATA = any> = d3.Selection<d3.EnterElement | d3.ContainerElement, DATA, d3.BaseType, any>;

export type D3AttributeValue<DATA = any> = d3.ValueFn<any, DATA, string | number | boolean | null> | string | number | boolean | null;

export enum D3SelectionType {
  SVG = 'svg',
  GROUP = 'g',
  RECT = 'rect',
  CIRCLE = 'circle',
  TEXT = 'text',
  PATH = 'path'
}
