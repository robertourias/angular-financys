import { Injectable, Injector } from "@angular/core";
import { Observable } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { EntryModel } from "./entry.model";
import { CategoryService } from "../../categories/shared/category.service";
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { EntriesModule } from '../entries.module';

import * as moment from 'moment';

@Injectable({
  providedIn: "root",
})
export class EntryService extends BaseResourceService<EntryModel> {

  constructor(
    private categoryService: CategoryService,
    protected injector: Injector
  ) {
    super("api/entries", injector, EntryModel.fromJson)
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.serCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.serCategoryAndSendToServer(entry, super.update.bind(this));
  }

  getByMonthAndYear(month: number, year: number): Observable<EntryModel[]> {
    // Ideal mandar pro back-end. Nosso caso com banco mocado
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    );
  }

  private serCategoryAndSendToServer(entry: EntryModel, sendFn: any): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap((category) => {
        entry.category = category;

        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }

  // Método pra tratar o mock
  private filterByMonthAndYear(entries: EntryModel[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate
      if(monthMatches && yearMatches) {
        return entry;
      }
    })
  }

}
