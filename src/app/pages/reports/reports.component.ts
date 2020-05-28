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

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories);
  }


  generateReports(){
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if(!month || !year) {
      alert('Você precisa selecionar o Mês e o Ano para gerar os relatórios');
    }
    else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this));
    }
  }


  private setValues(entries: EntryModel[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }


  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if(entry.type === 'revenue')
        revenueTotal += parseFloat(entry.amount.replace(',','.'));

      else
        expenseTotal += parseFloat(entry.amount.replace(',','.'));

    });

    this.expenseTotal = expenseTotal.toString().replace('.',',');
    this.revenueTotal = revenueTotal.toString().replace('.',',');
    this.balance = (revenueTotal - expenseTotal).toString().replace('.',',');
  }


  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }


  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];
    this.categories.forEach(category => {
      // Filtrando lançamentos pela categoria e tipo
      const filteredEntries = this.entries.filter(entry => entry.categoryId == category.id && entry.type == entryType);

      // Só mostrar categorias no grafico que tenham lançamentos
      if(filteredEntries.length> 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + parseFloat(entry.amount), 0
        );

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        });
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }

}
