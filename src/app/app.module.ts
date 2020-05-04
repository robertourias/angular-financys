import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TesteComponentComponent } from "./teste-component/teste-component.component";
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, TesteComponentComponent],
  imports: [
    CoreModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
