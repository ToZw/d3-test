import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { D3ChartComponent } from './d3-chart/d3-chart.component';


const routes: Routes = [
  { path: '', component: D3ChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
