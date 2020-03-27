export class D3SelectionWrapper<DATA> {

  protected selection: D3Selection<DATA>;

  public constructor(selection: D3Selection<DATA>) {
    this.selection = selection;

    // console.log((this.selection as any)._groups);
  }

  public getSelection(): D3Selection<DATA> {
    return this.selection;
  }

  public getId(): string {
    return this.selection.attr('id');
  }

  public id(value: string | null): this {
    return this.attr('id', value);
  }

  public transform(transform: D3AttributeValue<DATA>): this {
    return this.attr('transform', transform);
  }

  public datum<NEWDATA>(datum: NEWDATA): D3SelectionWrapper<NEWDATA> {
    return new D3SelectionWrapper<NEWDATA>(this.selection.datum<NEWDATA>(datum));
  }

  public data<NEWDATA>(data: NEWDATA[] | d3.ValueFn<any, any, NEWDATA[]>, key?: d3.ValueFn<any, DATA, string>): D3SelectionWrapper<NEWDATA> {
    return new D3SelectionWrapper<NEWDATA>(this.selection.data<NEWDATA>(data as any, key));
  }

  public join(
    enter: any,
    update?: (elem: D3Selection<DATA>) => D3Selection<DATA> | undefined,
    exit?: (elem: D3Selection<DATA>) => void): D3SelectionWrapper<DATA> {

    return new D3SelectionWrapper(this.selection.join(enter, update, exit));
  }

  public remove(): this {
    this.selection = this.selection.remove();
    return this;
  }

  public clone(deep?: boolean): D3SelectionWrapper<DATA> {
    return new D3SelectionWrapper<DATA>(this.selection.clone(deep));
  }

  public lower(): this {
    this.selection.lower();
    return this;
  }

  public select(selector: string | d3.ValueFn<any, DATA, any> | null): D3SelectionWrapper<DATA> | null {
    return new D3SelectionWrapper(this.selection.select(selector as any));
  }

  public selectAll(selector: string | d3.ValueFn<any, DATA, any[] | ArrayLike<any>> | null): D3SelectionWrapper<DATA> | null {
    return new D3SelectionWrapper(this.selection.selectAll(selector as any));
  }

  // private createSelectionWrapper(selection: D3Selection<DATA>): D3SelectionWrapper<DATA> | null {
  //   const node: SVGGElement = selection.node();

  //   if (!node) {
  //     return null;
  //   }

  //   switch (node.tagName) {
  //     case D3SelectionType.RECT:
  //       return new D3RectWrapper<DATA>(selection);
  //     case D3SelectionType.TEXT:
  //       return new D3TextWrapper<DATA>(selection);
  //     case D3SelectionType.PATH:
  //       return new D3PathWrapper<DATA>(selection);
  //     case D3SelectionType.GROUP:
  //       return new D3GroupWrapper<DATA>(selection);
  //     default:
  //       throw new Error(`The found tagname is not supported yet!, ${node.tagName}`);
  //   }
  // }

  // public selectFirstRect(): D3RectWrapper<DATA> {
  //   return new D3RectWrapper<DATA>(this.selection.select(D3SelectionType.RECT));
  // }

  // public selectFirstText(): D3TextWrapper<DATA> {
  //   return new D3TextWrapper<DATA>(this.selection.select(D3SelectionType.TEXT));
  // }

  protected attr(name: string, value: D3AttributeValue<DATA>): this {
    this.selection.attr(name, value as any);
    return this;
  }

  public onClick(clickFunction: d3.ValueFn<any, DATA, void>, capture?: boolean): this {
    this.selection.on('click', clickFunction, capture);
    return this;
  }
}

export type D3Selection<DATA> = d3.Selection<SVGGElement, DATA, d3.BaseType, any>;

// export interface TestoSelection<DATA> extends d3.Selection<SVGGElement, DATA, d3.BaseType, any> {
//   groups: d3.Selection<SVGGElement, DATA, d3.BaseType, any>[];
//   parents: d3.Selection<SVGGElement, DATA, d3.BaseType, any>[];
// }

export type D3AttributeValue<DATA> = d3.ValueFn<any, DATA, string | number | boolean | null> | string | number | boolean | null;

export enum D3SelectionType {
  GROUP = 'g',
  RECT = 'rect',
  CIRCLE = 'circle',
  TEXT = 'text',
  PATH = 'path'
}
