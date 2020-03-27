import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { D3ChartComponent } from './d3-chart/d3-chart.component';
import { D3TreeChartComponent } from './d3-tree-chart/d3-tree-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    D3ChartComponent,
    D3TreeChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
