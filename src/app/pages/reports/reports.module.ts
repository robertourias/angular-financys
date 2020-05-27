import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsComponent } from './reports.component';

import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    SharedModule,
    ReportsRoutingModule,
    ChartModule,
  ]
})
export class ReportsModule { }
