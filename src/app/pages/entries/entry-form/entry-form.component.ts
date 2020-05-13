import { Component, Injector, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";
import { EntryService } from "../shared/entry.service";
import { EntryModel } from "../shared/entry.model";
import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";
import { BaseResourceComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: "app-Entry-form",
  templateUrl: "./Entry-form.component.html",
  styleUrls: ["./Entry-form.component.css"],
})
export class EntryFormComponent extends BaseResourceComponent<EntryModel> implements OnInit {
  categories: Category[];
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousantsSeparator: "",
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ",",
  };
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    today: "Hoje",
    clear: "Limpar",
  };

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new EntryModel(), entryService, EntryModel.fromJson)
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadCategories();
  }

  get typeOptions(): Array<any> {
    return Object.entries(EntryModel.types).map(([value, text]) => {
      return {
        value: value,
        text: text,
      };
    });
  }

  protected loadCategories() {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  protected creationTitle(): string {
    return 'Cadastro da novo lançamento'
  }

  protected editionTitle(): string {
    const entryName = this.resource.name || '';
    return 'Editando lançamento '+entryName;
  }
}
