import { D3Selection, D3SelectionType } from './d3-selection.wrapper';
import { D3RectWrapper } from './d3-rect.wrapper';
import { D3TextWrapper } from './d3-text.wrapper';
import { D3ContainerWrapper } from './d3-container.wrapper';
import { D3CircleWrapper } from './d3-circle.wrapper copy';

export class D3GroupWrapper<DATA> extends D3ContainerWrapper<DATA> {

  public constructor(selection: D3Selection<DATA>) {
    super(selection);
  }

  // public select(selector: string | d3.ValueFn<any, DATA, any> | null): D3SelectionWrapper<DATA> | null {
  //   return this.createSelectionWrapper(this.selection.select(selector as any));
  // }

  // public selectAll(selector: string | d3.ValueFn<any, DATA, any[] | ArrayLike<any>> | null): D3SelectionWrapper<DATA>[] | null {
  //   throw new Error('This method is not implemented yet.');
  //   // const selection: D3DnDSelection<DATA> = this.selection.selectAll(selector as any);

  //   // selection.each

  //   // return null;
  // }

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

  public selectFirstRect(): D3RectWrapper<DATA> {
    return new D3RectWrapper<DATA>(this.selection.select(D3SelectionType.RECT));
  }

  public selectFirstText(): D3TextWrapper<DATA> {
    return new D3TextWrapper<DATA>(this.selection.select(D3SelectionType.TEXT));
  }

  public appendGroup(): D3GroupWrapper<DATA> {
    return D3GroupWrapper.create<DATA>(this.selection);
  }

  public appendRect(): D3RectWrapper<DATA> {
    return D3RectWrapper.create<DATA>(this.selection);
  }

  public appendCircle(): D3CircleWrapper<DATA> {
    return D3CircleWrapper.create<DATA>(this.selection);
  }

  public appendText(): D3TextWrapper<DATA> {
    return D3TextWrapper.create<DATA>(this.selection);
  }

  public static create<DATA>(selection: D3Selection<DATA>): D3GroupWrapper<DATA> {
    return new D3GroupWrapper<DATA>(selection.append(D3SelectionType.GROUP));
  }
}
