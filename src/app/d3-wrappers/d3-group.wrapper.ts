import { DnDModule } from '../d3-chart/d3-chart.component';
import { D3SelectionWrapper, D3DnDSelection } from './d3-selection.wrapper';
import { D3RectWrapper } from './d3-rect.wrapper';
import { D3TextWrapper } from './d3-text.wrapper';

export class D3GroupWrapper<DATA extends DnDModule = DnDModule> extends D3SelectionWrapper<DATA> {

  public constructor(selection: D3DnDSelection<DATA>) {
    super(selection);
  }

  public select(selector: string | d3.ValueFn<any, DATA, any> | null): D3SelectionWrapper<DATA> {
    const selection: D3DnDSelection = this.selection.select(selector as any);

    console.log('selection', selection);
    console.log('selection.node', selection.node);
    return null;
  }

  // public selectAll(selector: string | d3.ValueFn<any, DATA, any[] | ArrayLike<any>> | null): D3SelectionWrapper[] {
  //   return this.selection.selectAll(selector as any);
  // }

  public selectFirstRect(): D3RectWrapper<DATA> {
    return new D3RectWrapper<DATA>(this.selection.select('rect'));
  }

  public selectFirstText(): D3TextWrapper<DATA> {
    return new D3TextWrapper<DATA>(this.selection.select('text'));
  }

  public appendRect(): D3RectWrapper<DATA> {
    return D3RectWrapper.create<DATA>(this.selection);
  }

  public appendText(): D3TextWrapper<DATA> {
    return D3TextWrapper.create<DATA>(this.selection);
  }

  public static create<DATA extends DnDModule>(selection: D3DnDSelection<DATA>): D3GroupWrapper<DATA> {
    return new D3GroupWrapper<DATA>(selection.append('g'));
  }
}
