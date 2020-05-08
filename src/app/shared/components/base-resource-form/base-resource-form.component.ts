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
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDatatoResourceFn: (jsonData) => T

  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction === 'new') {
      this.createResource();
    }
    else {
      this.udpateResource();
    }
  }

  protected setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  protected loadResource() {
    if (this.currentAction === "edit") {
      this.route.paramMap
        .pipe(
          switchMap((param) => this.resourceService.getById(+param.get("id")))
        )
        .subscribe(
          (resource) => {
            this.resource = resource;
            this.resourceForm.patchValue(resource); // binds loaded resource data to ResurceForm
          },
          (error) => {
            console.log(error);
            alert("Ocorreu um erro no servidor, tente mais tarde!");
          }
        );
    }
  }

  protected setPageTitle() {
    if (this.currentAction === "new") {
      this.pageTitle = this.creationTitle();
    } else {
      this.pageTitle = this.editionTitle();
    }
  }

  protected creationTitle(): string {
    return 'Novo'
  }

  protected editionTitle(): string {
    return 'Edição'
  }

  protected createResource() {
    const resource: T = this.jsonDatatoResourceFn(this.resourceForm.value);

    this.resourceService.create(resource).subscribe((resource) => {
      this.actionsForSuccess(resource);
    }, (error) => {
      this.actionsForError(error);
    });
  }

  protected udpateResource() {
    const resource: T = this.jsonDatatoResourceFn(this.resourceForm.value);

    this.resourceService.update(resource).subscribe((resource) => {
      this.actionsForSuccess(resource);
    }, (error) => {
      this.actionsForError(error);
    });
  }

  protected actionsForSuccess(resource: T) {
    toastr.success('Solicitação processada com sucesso!');
    const baseComponentPath = this.route.snapshot.parent.url[0].path;

    // redirect/reload page
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(() => {
      if(this.currentAction === "new") {
        this.router.navigate([baseComponentPath, resource.id, 'edit']);
      }
    });
  }

  protected actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    }
    else {
      this.serverErrorMessages = ['Falha na comunicação. Por favor, tente mais tarde!'];
    }

  }

  protected abstract buildResourceForm(): void;

}
