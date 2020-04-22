import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../shared/category.service";
import { Category } from "../shared/category.model";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit {
  categories: Category[];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error: any) => {
        alert("Erro ao carregar a lista: " + error);
      }
    );
  }

  delete(category: Category): void {
    const mustDelete = confirm("Deseja realmente excluir este item?");

    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => {
          this.categories = this.categories.filter((elem) => elem !== category);
        },
        () => {
          alert("Erro ao tentar excluir.");
        }
      );
    }
  }
}
