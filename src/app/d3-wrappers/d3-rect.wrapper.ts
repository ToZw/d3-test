import { DnDModule } from '../d3-chart/d3-chart.component';
import { D3SelectionWrapper, D3AttributeValue, D3DnDSelection, D3SelectionType } from './d3-selection.wrapper';

export class D3RectWrapper<DATA extends DnDModule = DnDModule> extends D3SelectionWrapper<DATA> {

  public constructor(selection: D3DnDSelection<DATA>) {
    super(selection);
  }

  public width(width: D3AttributeValue<DATA>): this {
    return this.attr('width', width);
  }

  public height(height: D3AttributeValue<DATA>): this {
    return this.attr('height', height);
  }

  public fill(color: D3AttributeValue<DATA>): this {
    return this.attr('fill', color);
  }

  public stroke(color: D3AttributeValue<DATA>): this {
    return this.attr('stroke', color);
  }

  public strokeDasharray(dashArray: D3AttributeValue<DATA>): this {
    return this.attr('stroke-dasharray', dashArray);
  }

  public strokeLinecap(lineCap: D3AttributeValue<DATA>): this {
    return this.attr('stroke-linecap', lineCap);
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

  public static create<DATA extends DnDModule>(selection: D3DnDSelection<DATA>): D3RectWrapper<DATA> {
    return new D3RectWrapper<DATA>(selection.append(D3SelectionType.RECT));
  }
}
