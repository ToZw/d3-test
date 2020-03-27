import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { D3ChartComponent } from './d3-chart/d3-chart.component';
import { D3TreeChartComponent } from './d3-tree-chart/d3-tree-chart.component';


const routes: Routes = [
  { path: '', component: D3ChartComponent },
  { path: 'dnd-chart', component: D3ChartComponent },
  { path: 'tree', component: D3TreeChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
