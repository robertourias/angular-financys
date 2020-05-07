import { OnInit, AfterContentChecked, Injector } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import toastr from "toastr";
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {
  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resurce: T,
    protected baseResourceService: BaseResourceService<T>,
    protected jsonDatatoResourceFn: (jsonData) => T

  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction === 'new') {
      this.createCategory();
    }
    else {
      this.udpateCategory();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  private loadCategory() {
    if (this.currentAction === "edit") {
      this.route.paramMap
        .pipe(
          switchMap((param) => this.categoryService.getById(+param.get("id")))
        )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category); // binds loaded category data to CategoryForm
          },
          (error) => {
            console.log(error);
            alert("Ocorreu um erro no servidor, tente mais tarde!");
          }
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction === "new") {
      this.pageTitle = "Nova Categoria";
    } else {
      const categoryName = this.category.name || "";
      this.pageTitle = `Alterando categoria ${categoryName}`;
    }
  }

  private createCategory() {
    const category = Object.assign(new Category, this.categoryForm.value);

    this.categoryService.create(category).subscribe((category) => {
      this.actionsForSuccess(category);
    }, (error) => {
      this.actionsForError(error);
    });
  }

  private udpateCategory() {
    const category = Object.assign(new Category, this.categoryForm.value);

    this.categoryService.update(category).subscribe((category) => {
      this.actionsForSuccess(category);
    }, (error) => {
      this.actionsForError(error);
    });
  }

  private actionsForSuccess(category: Category) {
    toastr.success('Solicitação processada com sucesso!');

    // redirect/reload page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(() => {
      if(this.currentAction === "new") {
        this.router.navigate(['categories', category.id, 'edit']);
      }
    });
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    }
    else {
      this.serverErrorMessages = ['Falha na comunicação. Por favor, tente mais tarde!'];
    }

  }

}
