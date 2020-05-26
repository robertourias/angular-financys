import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-fields-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-fields-error.component.css']
})
export class FormFieldsErrorComponent implements OnInit {
  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
    if(this.mustShorErrorMessage()) {
      return this.getErrorMessage();
    }
    else {
      return null;
    }
  }

  private mustShorErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if(this.formControl.errors.required)
      return "dado obrigatório";

    else if(this.formControl.errors.email)
      return "Formato do campo de e-mail inválido";

    else if(this.formControl.errors.minlength) {
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `deve ter no minimo ${requiredLength} caractéres`;
    }

    else if(this.formControl.errors.maxlength) {
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `deve ter no máximo ${requiredLength} caractéres`;
    }
  }

}
