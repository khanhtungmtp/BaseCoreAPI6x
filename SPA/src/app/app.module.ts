import { LocalStorageContains } from './_core/_constants/localStorageContains';
import { AuthGuard } from './_core/_guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { GlobalHttpInterceptorProvider } from './_core/_helpers/utilities/global-http-interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './_core/_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListsComponent } from './views/lists/lists.component';
import { MessagesComponent } from './views/messages/messages.component';
import { routes } from './routes';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { PreventUnsavedChanges } from './_core/_guards/profile/prevent-unsaved-changes-guard';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
export function tokenGetter() {
  return localStorage.getItem(LocalStorageContains.TOKEN);
}
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ListsComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.allowedDomains,
        disallowedRoutes: environment.disallowedRoutes
      }
    }),
  ],
  providers: [
    AuthService,
    GlobalHttpInterceptorProvider,
    AuthGuard,
    PreventUnsavedChanges

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
