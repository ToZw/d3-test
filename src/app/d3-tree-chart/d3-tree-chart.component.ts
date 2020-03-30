import * as d3 from "d3";
import { Component, OnInit } from '@angular/core';
import { treeData } from './example.json';
import { D3SelectionTest, D3SelectionType } from '../d3-wrappers/d3-selection-test';

@Component({
  selector: 'app-d3-tree-chart',
  templateUrl: './d3-tree-chart.component.html',
  styleUrls: ['./d3-tree-chart.component.scss']
})
export class D3TreeChartComponent implements OnInit {

  private zoom: number = 954;

  public constructor() {
  }

  ngOnInit() {
    const root: d3.HierarchyPointNode<any> = this.tree(treeData);
    const size: { start: number, end: number } = this.setSvgSize(root);

    const svg = D3SelectionTest
      .select('#tree-chart')
      .appendSVG()
      .viewBox([0, 0, this.zoom, size.start - size.end + (root as any).dx * 2] as any);

    const group: D3SelectionTest = svg
      .appendGroup()
      .fontFamily("sans-serif")
      .fontSize(10)
      .transform(`translate(${(root as any).dy / 3},${(root as any).dx - size.end})`);

    const link = group
      .appendGroup()
      .fill("none")
      .stroke("#555")
      .strokeOpacity(0.4)
      .strokeWidth(1.5)
      .selectAll(D3SelectionType.PATH)
      .data<d3.HierarchyPointLink<any>>(root.links())
      .join(D3SelectionType.PATH)
      .d(d3.linkHorizontal()
        .x(data => (data as any).y)
        .y(data => (data as any).x));

    const node = group
      .appendGroup()
      .strokeLinejoin("round")
      .strokeWidth(3)
      .selectAll(D3SelectionType.GROUP)
      .data<d3.HierarchyPointNode<any>>(root.descendants())
      .join(D3SelectionType.GROUP)
      .transform(data => `translate(${data.y},${data.x})`);

    node
      .appendCircle()
      .fill(data => data.children ? "#555" : "#999")
      .radius(2.5);

    node
      .appendText()
      .dy("0.31em")
      .x(data => data.children ? -6 : 6)
      .textAnchor(data => data.children ? "end" : "start")
      .text(data => data.data.name)
      .clone(true)
      .lower()
      .stroke("white");
  }

  private tree(data: any): d3.HierarchyPointNode<any> {
    const root: d3.HierarchyNode<any> = d3.hierarchy(data);

    (root as any).dx = 10;
    (root as any).dy = this.zoom / (root.height + 1);
    return d3.tree().nodeSize([(root as any).dx, (root as any).dy])(root);
  }

  private setSvgSize(root: d3.HierarchyPointNode<any>): { start: number, end: number } {
    let endX = Infinity;
    let startX = -endX;

    root.each(data => {
      if (data.x > startX) {
        startX = data.x
      }

      if (data.x < endX) {
        endX = data.x
      }
    });

    return { start: startX, end: endX };
  }
}
