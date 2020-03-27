import { D3AttributeValue, D3Selection, D3SelectionType } from './d3-selection.wrapper';
import { D3ContainerWrapper } from './d3-container.wrapper';

export class D3RectWrapper<DATA> extends D3ContainerWrapper<DATA> {

  public constructor(selection: D3Selection<DATA>) {
    super(selection);
  }

  public width(width: D3AttributeValue<DATA>): this {
    return this.attr('width', width);
  }

  public height(height: D3AttributeValue<DATA>): this {
    return this.attr('height', height);
  }

  public static create<DATA>(selection: D3Selection<DATA>): D3RectWrapper<DATA> {
    return new D3RectWrapper<DATA>(selection.append(D3SelectionType.RECT));
  }
}
