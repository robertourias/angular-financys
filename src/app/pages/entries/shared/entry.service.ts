import { Injectable, Injector } from "@angular/core";
import { Observable } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { EntryModel } from "./entry.model";
import { CategoryService } from "../../categories/shared/category.service";
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

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
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap((category) => {
        entry.category = category;

        return super.create(entry);
      })
    );
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap((category) => {
        entry.category = category;

        return super.update(entry);
      })
    );
  }
}
