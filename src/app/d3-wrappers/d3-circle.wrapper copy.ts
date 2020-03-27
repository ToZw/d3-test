import { D3AttributeValue, D3Selection, D3SelectionType } from './d3-selection.wrapper';
import { D3ContainerWrapper } from './d3-container.wrapper';

export class D3CircleWrapper<DATA> extends D3ContainerWrapper<DATA> {

  public constructor(selection: D3Selection<DATA>) {
    super(selection);
  }

  public radius(radius: D3AttributeValue<DATA>): this {
    return this.attr('r', radius);
  }

  public static create<DATA>(selection: D3Selection<DATA>): D3CircleWrapper<DATA> {
    return new D3CircleWrapper<DATA>(selection.append(D3SelectionType.CIRCLE));
  }
}
