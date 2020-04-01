import * as d3 from "d3";

export class D3SelectionTest {

  protected selection: D3Selection;

  public constructor(selection: D3Selection) {
    this.selection = selection;
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

  public getDatum(): any {
    return this.selection.datum();
  }

  public datum<NEWDATA>(datum: NEWDATA): D3SelectionTest {
    return new D3SelectionTest(this.selection.datum<NEWDATA>(datum));
  }

  public getData(): any[] {
    return this.selection.data();
  }

  /**
   * This function passes new data to the selection.
   * The parameter 'key' is required, because otherwise strange bugs can appear, if the key isn't present and d3-data can't
   * distinguish between the data.
   */
  public data<NEWDATA>(data: NEWDATA[] | d3.ValueFn<any, any, NEWDATA[]>, key: d3.ValueFn<any, any, string>): D3SelectionTest {
    return new D3SelectionTest(this.selection.data<NEWDATA>(data as any, key));
  }

  public filter(filter: D3AttributeValue): D3SelectionTest {
    return new D3SelectionTest(this.selection.filter(filter as any));
  }

  public filterEmptyGroups(): D3SelectionTest {
    return this.filter((nodeGroup: d3.HierarchyPointNode<any>, index: number, nodes: SVGGElement[]) => nodes[index].children.length === 0);
  }

  public merge(other: D3SelectionTest): D3SelectionTest {
    return new D3SelectionTest(this.selection.merge(other.getSelection()));
  }

  public enter(): D3SelectionTest {
    return new D3SelectionTest(this.selection.enter());
  }

  public exit<OldDatum>(): D3SelectionTest {
    return new D3SelectionTest(this.selection.exit<OldDatum>());
  }

  /**
   * The d3-join-function receives all "enter", "update", "exit" elements.
   * If an "update"-function is passed the passed update-function will be triggered.
   * Afterwards if there is an "exit"-function passed the passed exit-function will be triggered, otherwise it will remove all
   * exit elements by default.
   * In the end if there are "enter" elements, they will be merge with the "update" elements and after that, they will be ordered.
   * If there are no "enter" elements, the "update" elements will be returned.
   *
   * @param enter
   * @param update
   * @param exit
   */
  public join<TAG extends keyof ElementTagNameMap, OldDatum>(
    enter: TAG | string | ((elem: D3SelectionTest) => D3SelectionTest),
    update?: (elem: D3SelectionTest) => D3SelectionTest | undefined,
    exit?: (elem: D3SelectionTest) => void): D3SelectionTest {

    let updateWrapper: (elem: D3Selection) => D3Selection;
    let exitWrapper: (elem: D3Selection) => void;

    /* Need to wrap the D3-join parameters and return type to work with our D3Selection type */
    if (update) {
      updateWrapper = (elem: D3Selection) => {
        /* Changing the paramter type for the API */
        const result = update(new D3SelectionTest(elem))

        /* Changing the return type for the d3-join-api */
        return result.getSelection();
      };
    }

    if (exit) {
      exitWrapper = (elem: D3Selection) => exit(new D3SelectionTest(elem));
    }

    return new D3SelectionTest(this.selection.join(enter as any, updateWrapper, exitWrapper));
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

  public selectFirstPath(): D3SelectionTest {
    return this.select(D3SelectionType.PATH);
  }

  public selectById(id: string): D3SelectionTest {
    return new D3SelectionTest(this.selection.select(`#${id}`));
  }

  public select(selector: string | d3.ValueFn<any, any, any> | null): D3SelectionTest {
    return new D3SelectionTest(this.selection.select(selector as any));
  }

  public selectAll(selector: string | d3.ValueFn<any, any, any[] | ArrayLike<any>> | null): D3SelectionTest {
    return new D3SelectionTest(this.selection.selectAll(selector as any));
  }

  public empty(): boolean {
    return this.selection.empty();
  }

  /**
   * Invoke the specified function for each selected element, passing in the current datum (d),
   * the current index (i), and the current group (nodes), with this of the current DOM element (nodes[i]).
   * This method can be used to invoke arbitrary code for each selected element, and is useful for creating a context to access parent and child data simultaneously.
   *
   * @param func A function which is invoked for each selected element,
   *             being passed the current datum (d), the current index (i), and the current group (nodes), with this of the current DOM element (nodes[i]).
   */
  public each(func: d3.ValueFn<any, any, void>): this {
    this.selection.each(func);
    return this;
  }

  /**
   * Return the first (non-null) element in this selection. If the selection is empty, returns null.
   */
  node(): any | null {
    return this.selection.node();
  }

  /**
   * Return an array of all (non-null) elements in this selection.
   */
  nodes(): any[] {
    return this.selection.nodes();
  }

  /**
   * Returns the total number of elements in this selection.
   */
  public size(): number {
    return this.selection.size();
  }

  public dndType(dndType: D3AttributeValue): this {
    return this.attr('dndType', dndType);
  }

  public getType(): string {
    return this.getAttr('type');
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

  /**
   * This function centering the text in the given size of the rect.
   * If no size is passed, the datas 'width' and 'height' property is taken.
   *
   * @param size the size of the rect, the text should be centered.
   * @see https://stackoverflow.com/a/47319284
   */
  public centerTextInRect(size?: { rectWidth: number, rectHeight: number }): this {
    return this
      .x(data => (size && size.rectWidth ? size.rectWidth : data.width) / 2)
      .y(data => (size && size.rectHeight ? size.rectHeight : data.height) / 2)
      .dominantBaseline('middle')
      .textAnchor("middle");
  }

  public appendBackgroundColorRect(color: string): D3SelectionTest {
    return this
      .appendRect()
      .width('100%')
      .height('100%')
      .fill(color);
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


  public dominantBaseline(value: D3AttributeValue): this {
    return this.attr('dominant-baseline', value);
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

  public cursor(cursor: D3AttributeValue) {
    return this.attr('style', `cursor:${cursor}`);
  }
  // .attr('pointer-events', 'mouseover')

  public xLinkHref(id: D3AttributeValue) {
    return this.attr('xlink:href', `#${id}`);
  }

  protected getAttr(name: string): string {
    return this.selection.attr(name);
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

  public appendUse(): D3SelectionTest {
    return this.append(D3SelectionType.USE);
  }

  public appendDefs(): D3SelectionTest {
    return this.append(D3SelectionType.DEFS);
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

export type D3AttributeValue<DATA = any> = d3.ValueFn<any, DATA, string | number | boolean | null> | string | number | boolean | Array<any> | null;

export enum D3SelectionType {
  SVG = 'svg',
  GROUP = 'g',
  RECT = 'rect',
  CIRCLE = 'circle',
  TEXT = 'text',
  PATH = 'path',
  USE = 'use',
  DEFS = 'defs',
}
