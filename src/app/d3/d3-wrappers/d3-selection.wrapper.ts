import * as d3 from "d3";
import { NodeModelSize } from '../node-models/models/node.model';
export class D3SelectionWrapper<GElement extends d3.BaseType = any, Datum = any, PElement extends d3.BaseType = any, PDatum = any> {

  protected selection: D3Selection<GElement, Datum, PElement, PDatum>;

  public constructor(selection: D3Selection<GElement, Datum, PElement, PDatum>) {
    if (!selection) {
      throw new Error(`The parameter 'selection' is required!, ${selection}`);
    }

    this.selection = selection;
  }

  public getSelection(): D3Selection<GElement, Datum, PElement, PDatum> {
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

  public getDatum(): Datum {
    return this.selection.datum();
  }

  public datum<NewDatum>(datum: NewDatum): D3SelectionWrapper<GElement, NewDatum, PElement, PDatum> {
    return new D3SelectionWrapper<GElement, NewDatum, PElement, PDatum>(this.selection.datum<NewDatum>(datum));
  }

  public getData(): Datum[] {
    return this.selection.data();
  }

  /**
   * This function passes new data to the selection.
   * The parameter 'key' is required, because otherwise strange bugs can appear, if the key isn't present and d3-data can't
   * distinguish between the data.
   */
  public data<NewDatum>(
    data: NewDatum[] | d3.ValueFn<PElement, PDatum, NewDatum[]>,
    key: d3.ValueFn<GElement | PElement, Datum | NewDatum, string>): D3SelectionWrapper<GElement, NewDatum, PElement, PDatum> {

    return new D3SelectionWrapper<GElement, NewDatum, PElement, PDatum>(this.selection.data<NewDatum>(data as any, key));
  }

  public filter(filter: D3AttributeValue): D3SelectionWrapper<GElement, Datum, PElement, PDatum> {
    return new D3SelectionWrapper<GElement, Datum, PElement, PDatum>(this.selection.filter(filter as any));
  }

  public filterEmptyGroups(): D3SelectionWrapper<GElement, Datum, PElement, PDatum> {
    return this.filter((nodeGroup: Datum, index: number, nodes: SVGGElement[]) => nodes[index].children.length === 0);
  }

  public merge(other: D3SelectionWrapper<GElement, Datum, PElement, PDatum>): D3SelectionWrapper<GElement, Datum, PElement, PDatum> {
    return new D3SelectionWrapper<GElement, Datum, PElement, PDatum>(this.selection.merge(other.getSelection()));
  }

  public enter(): D3SelectionWrapper<d3.EnterElement, Datum, PElement, PDatum> {
    return new D3SelectionWrapper<d3.EnterElement, Datum, PElement, PDatum>(this.selection.enter());
  }

  public exit<OldDatum>(): D3SelectionWrapper<GElement, OldDatum, PElement, PDatum> {
    return new D3SelectionWrapper<GElement, OldDatum, PElement, PDatum>(this.selection.exit<OldDatum>());
  }

  /**
   * The d3-join-function receives all "enter", "update", "exit" elements.
   * If an "update"-function is passed the passed update-function will be triggered.
   * Afterwards if there is an "exit"-function passed the passed exit-function will be triggered, otherwise it will remove all
   * exit elements by default.
   * In the end if there are "enter" elements, they will be merge with the "update" elements and after that, they will be ordered.
   * If there are no "enter" elements, the "update" elements will be returned.
   *
   * @param enter elements to append, not {@code null}
   * @param update the executed update-function or {@code null}
   * @param exit the executed exit-function or {@code null}
   */
  public join<TAG extends keyof ElementTagNameMap, OldDatum>(
    enter: TAG | string | ((elem: D3SelectionWrapper) => D3SelectionWrapper),
    update?: (elem: D3SelectionWrapper) => D3SelectionWrapper | undefined,
    exit?: (elem: D3SelectionWrapper) => void): D3SelectionWrapper {

    let updateWrapper: (elem: D3Selection) => D3Selection;
    let exitWrapper: (elem: D3Selection) => void;

    /* Need to wrap the D3-join parameters and return type to work with our D3Selection type */
    if (update) {
      updateWrapper = (elem: D3Selection) => {
        /* Changing the paramter type for the API */
        const result = update(new D3SelectionWrapper(elem))

        /* Changing the return type for the d3-join-api */
        return result.getSelection();
      };
    }

    if (exit) {
      exitWrapper = (elem: D3Selection) => exit(new D3SelectionWrapper(elem));
    }

    return new D3SelectionWrapper(this.selection.join(enter as any, updateWrapper, exitWrapper));
  }


  public getChildren(): D3SelectionWrapper<GElement, Datum, GElement, Datum> {
    return this.selectAll<GElement, Datum>('*');
  }

  public remove(): this {
    this.selection = this.selection.remove();
    return this;
  }

  public removeChildren(): this {
    const childrenSelection = this.getChildren();

    childrenSelection.remove();
    return this;
  }

  public clone(deep?: boolean): D3SelectionWrapper<GElement, Datum, PElement, PDatum> {
    return new D3SelectionWrapper<GElement, Datum, PElement, PDatum>(this.selection.clone(deep));
  }

  public lower(): this {
    this.selection.lower();
    return this;
  }

  public selectFirstRect(): D3SelectionWrapper {
    return this.select(D3SelectionType.RECT);
  }

  public selectFirstText(): D3SelectionWrapper {
    return this.select(D3SelectionType.TEXT);
  }

  public selectFirstPath(): D3SelectionWrapper {
    return this.select(D3SelectionType.PATH);
  }

  public selectById(id: string): D3SelectionWrapper {
    return new D3SelectionWrapper(this.selection.select(`#${id}`));
  }

  public selectByClass(classId: string): D3SelectionWrapper {
    return new D3SelectionWrapper(this.selection.select(`.${classId}`));
  }

  public select<DescElement extends d3.BaseType>(selector: string | d3.ValueFn<GElement, Datum, DescElement> | null): D3SelectionWrapper<DescElement | null, Datum | undefined, PElement, PDatum> {
    return new D3SelectionWrapper<DescElement | null, Datum | undefined, PElement, PDatum>(this.selection.select<DescElement>(selector as any));
  }

  public selectAll<DescElement extends d3.BaseType, OldDatum>(selector?: string | d3.ValueFn<GElement, Datum, DescElement[] | ArrayLike<DescElement>> | null): D3SelectionWrapper<DescElement | null, OldDatum | undefined, GElement, Datum> {
    return new D3SelectionWrapper<DescElement | null, OldDatum | undefined, GElement, Datum>(this.selection.selectAll<DescElement, OldDatum>(selector as any));
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
  node(): GElement | null {
    return this.selection.node();
  }

  /**
   * Return an array of all (non-null) elements in this selection.
   */
  nodes(): GElement[] {
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
  public centerTextInRect(size?: NodeModelSize): this {
    return this
      .x(node => (size && size.width ? size.width : node.data.width) / 2)
      .y(node => (size && size.height ? size.height : node.data.height) / 2)
      .dominantBaseline('middle')
      .textAnchor("middle");
  }

  public centerTextInCircle(): this {
    return this
      .x(node => node.cx ? node.cx : 0)
      .y(node => node.cy ? node.cy : 0)
      .dominantBaseline('middle')
      .textAnchor("middle");
  }

  public appendBackgroundColorRect(color: string): D3SelectionWrapper {
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

  public cx(cx: D3AttributeValue): this {
    return this.attr('cx', cx);
  }

  public cy(cy: D3AttributeValue): this {
    return this.attr('cy', cy);
  }

  public dx(dx: D3AttributeValue): this {
    return this.attr('dx', dx);
  }

  public dy(dy: D3AttributeValue): this {
    return this.attr('dy', dy);
  }

  public rx(rx: D3AttributeValue): this {
    return this.attr('rx', rx);
  }

  public ry(ry: D3AttributeValue): this {
    return this.attr('ry', ry);
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

  public isClassed(names: string): boolean {
    return this.selection.classed(names);
  }

  public classed(names: string, value: boolean | d3.ValueFn<GElement, Datum, boolean>): this {
    this.selection.classed(names, value as any);
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

  public appendSVG(): D3SelectionWrapper {
    return this.append(D3SelectionType.SVG);
  }

  public appendGroup(): D3SelectionWrapper {
    return this.append(D3SelectionType.GROUP);
  }

  public appendRect(): D3SelectionWrapper {
    return this.append(D3SelectionType.RECT);
  }

  public appendCircle(): D3SelectionWrapper {
    return this.append(D3SelectionType.CIRCLE);
  }

  public appendEllipse(): D3SelectionWrapper {
    return this.append(D3SelectionType.ELLIPSE);
  }

  public appendText(): D3SelectionWrapper {
    return this.append(D3SelectionType.TEXT);
  }

  public appendPath(): D3SelectionWrapper {
    return this.append(D3SelectionType.PATH);
  }

  public appendUse(): D3SelectionWrapper {
    return this.append(D3SelectionType.USE);
  }

  public appendDefs(): D3SelectionWrapper {
    return this.append(D3SelectionType.DEFS);
  }

  public appendSelection(d3SelectionWrapper: D3SelectionWrapper<GElement, Datum, PElement, PDatum>): D3SelectionWrapper<GElement, Datum, PElement, PDatum> {
    return new D3SelectionWrapper<GElement, Datum, PElement, PDatum>(this.selection.append<GElement>(() => d3SelectionWrapper.getSelection().node()));
  }

  /**
   * Missing Generics compares to d3-append.
   */
  private append<K extends keyof ElementTagNameMap>(type: K): D3SelectionWrapper<ElementTagNameMap[K], Datum, PElement, PDatum> {
    return new D3SelectionWrapper<ElementTagNameMap[K], Datum, PElement, PDatum>(this.selection.append<K>(type));
  }

  public static select(selector: string | d3.ValueFn<any, any, any> | null): D3SelectionWrapper {
    return new D3SelectionWrapper(d3.select(selector as any));
  }

  public static selectById(id: string): D3SelectionWrapper {
    return new D3SelectionWrapper(d3.select(`#${id}`));
  }

  public static selectAll(selector: string | d3.ValueFn<any, any, any[] | ArrayLike<any>> | null): D3SelectionWrapper {
    return new D3SelectionWrapper(d3.selectAll(selector as any));
  }
}

export type D3Selection<GElement extends d3.BaseType = any, Datum = any, PElement extends d3.BaseType = any, PDatum = any> = d3.Selection<GElement, Datum, PElement, PDatum>;

export type D3AttributeValue<GElement extends d3.BaseType = any, Datum = any> = d3.ValueFn<GElement, Datum, string | number | boolean | null> | string | number | boolean | Array<any> | null;

export enum D3SelectionType {
  CIRCLE = 'circle',
  DEFS = 'defs',
  ELLIPSE = 'ellipse',
  GROUP = 'g',
  PATH = 'path',
  RECT = 'rect',
  SVG = 'svg',
  TEXT = 'text',
  USE = 'use',
}
