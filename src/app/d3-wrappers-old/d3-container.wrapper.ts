import { D3SelectionWrapper, D3AttributeValue, D3Selection } from './d3-selection.wrapper';

export class D3ContainerWrapper<DATA> extends D3SelectionWrapper<DATA> {

  public constructor(selection: D3Selection<DATA>) {
    super(selection);
  }

  public fill(color: D3AttributeValue<DATA>): this {
    return this.attr('fill', color);
  }

  public stroke(color: D3AttributeValue<DATA>): this {
    return this.attr('stroke', color);
  }

  public strokeOpacity(opacity: D3AttributeValue<DATA>): this {
    return this.attr('stroke-opacity', opacity);
  }

  public strokeDasharray(dashArray: D3AttributeValue<DATA>): this {
    return this.attr('stroke-dasharray', dashArray);
  }

  public strokeLinecap(lineCap: D3AttributeValue<DATA>): this {
    return this.attr('stroke-linecap', lineCap);
  }

  public strokeLinejoin(strokeLinejoin: D3AttributeValue<DATA>): this {
    return this.attr('stroke-linejoin', strokeLinejoin);
  }

  public strokeWidth(width: D3AttributeValue<DATA>): this {
    return this.attr('stroke-width', width);
  }

  public setSolidBorder() {
    return this.stroke('#2378ae')
      .strokeDasharray('unset')
      .strokeLinecap('butt')
      .strokeWidth('3');
  }

  public setDashedBorder() {
    return this.stroke('#2378ae')
      .strokeDasharray('10.5')
      .strokeLinecap('butt')
      .strokeWidth('3');
  }

  public fontFamily(fontFamily: D3AttributeValue<DATA>): this {
    return this.attr("font-family", fontFamily);
  }

  public fontSize(fontSize: D3AttributeValue<DATA>): this {
    return this.attr("font-size", fontSize);
  }
}
