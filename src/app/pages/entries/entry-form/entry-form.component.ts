import { Component, OnInit, AfterContentChecked } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EntryService } from "../shared/entry.service";
import { EntryModel } from "../shared/entry.model";

import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import toastr from "toastr";
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: "app-Entry-form",
  templateUrl: "./Entry-form.component.html",
  styleUrls: ["./Entry-form.component.css"],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm = false;
  entry: EntryModel = new EntryModel();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction === 'new') {
      this.createEntry();
    }
    else {
      this.udpateEntry();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amout: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction === "edit") {
      this.route.paramMap
        .pipe(
          switchMap((param) => this.entryService.getById(+param.get("id")))
        )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry); // binds loaded Entry data to EntryForm
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
      this.pageTitle = "Novo Lançamento";
    } else {
      const entryName = this.entry.name || "";
      this.pageTitle = `Alterando lançamento ${entryName}`;
    }
  }

  private createEntry() {
    const entry = Object.assign(new EntryModel, this.entryForm.value);

    this.entryService.create(entry).subscribe((entry) => {
      this.actionsForSuccess(entry);
    }, (error) => {
      this.actionsForError(error);
    });
  }

  private udpateEntry() {
    const entry = Object.assign(new EntryModel, this.entryForm.value);

    this.entryService.update(entry).subscribe((entry) => {
      this.actionsForSuccess(entry);
    }, (error) => {
      this.actionsForError(error);
    });
  }

  private actionsForSuccess(Entry: Entry) {
    toastr.success('Solicitação processada com sucesso!');

    // redirect/reload page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(() => {
      if(this.currentAction === "new") {
        this.router.navigate(['categories', Entry.id, 'edit']);
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
