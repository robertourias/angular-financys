import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { currecyFormatter } from 'currency-formatter';
import { Category } from '../categories/shared/category.model';
import { EntryModel } from '../entries/shared/entry.model';
import { EntryService } from '../entries/shared/entry.service';
import { CategoryService } from '../categories/shared/category.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: EntryModel[] = [];

  @ViewChild('mouth') mouth: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories);
  }

  generateReports(){
    const month = this.mouth.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year) {
      alert('Você precisa selecionar o Mês e o Ano para gerar os relatórios');
    }
    else {
      this.entryService.getByMonthAndYear(month, year);
    }
  }

}
