import { DnDModule } from '../d3-chart/d3-chart.component';
import { D3SelectionWrapper, D3DnDSelection, D3SelectionType } from './d3-selection.wrapper';
import { D3RectWrapper } from './d3-rect.wrapper';
import { D3TextWrapper } from './d3-text.wrapper';
import { D3PathWrapper } from './d3-path.wrapper';

export class D3GroupWrapper<DATA extends DnDModule = DnDModule> extends D3SelectionWrapper<DATA> {

  public constructor(selection: D3DnDSelection<DATA>) {
    super(selection);
  }

  public select(selector: string | d3.ValueFn<any, DATA, any> | null): D3SelectionWrapper<DATA> | null {
    return this.createSelectionWrapper(this.selection.select(selector as any));
  }

  public selectAll(selector: string | d3.ValueFn<any, DATA, any[] | ArrayLike<any>> | null): D3SelectionWrapper<DATA>[] | null {
    throw new Error('This method is not implemented yet.');
    // const selection: D3DnDSelection<DATA> = this.selection.selectAll(selector as any);

    // selection.each

    // return null;
  }

  private createSelectionWrapper(selection: D3DnDSelection<DATA>): D3SelectionWrapper<DATA> | null {
    const node: SVGGElement = selection.node();

    if (!node) {
      return null;
    }

    switch (node.tagName) {
      case D3SelectionType.RECT:
        return new D3RectWrapper<DATA>(selection);
      case D3SelectionType.TEXT:
        return new D3TextWrapper<DATA>(selection);
      case D3SelectionType.PATH:
        return new D3PathWrapper<DATA>(selection);
      case D3SelectionType.GROUP:
        return new D3GroupWrapper<DATA>(selection);
      default:
        throw new Error(`The found tagname is not supported yet!, ${node.tagName}`);
    }
  }

  public selectFirstRect(): D3RectWrapper<DATA> {
    return new D3RectWrapper<DATA>(this.selection.select(D3SelectionType.RECT));
  }

  public selectFirstText(): D3TextWrapper<DATA> {
    return new D3TextWrapper<DATA>(this.selection.select(D3SelectionType.TEXT));
  }

  public appendRect(): D3RectWrapper<DATA> {
    return D3RectWrapper.create<DATA>(this.selection);
  }

  public appendText(): D3TextWrapper<DATA> {
    return D3TextWrapper.create<DATA>(this.selection);
  }

  public static create<DATA extends DnDModule>(selection: D3DnDSelection<DATA>): D3GroupWrapper<DATA> {
    return new D3GroupWrapper<DATA>(selection.append(D3SelectionType.GROUP));
  }
}
