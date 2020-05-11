import { Component, Injector } from "@angular/core";
import { Validators } from "@angular/forms";

import { BaseResourceComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
import { CategoryService } from "../shared/category.service";
import { Category } from "../shared/category.model";


@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.css"],
})
export class CategoryFormComponent extends BaseResourceComponent<Category> {
  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new Category(), categoryService, Category.fromJson)
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  protected creationTitle(): string {
    return 'Cadastro da nova categoria'
  }

  protected editionTitle(): string {
    const categoryName = this.resource.name || '';
    return 'Editando categoria '+categoryName;
  }
}
