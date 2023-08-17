import { LocalStorageContains } from './_core/_constants/localStorageContains';
import { AuthGuard } from './_core/_guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { GlobalHttpInterceptorProvider } from './_core/_helpers/utilities/global-http-interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './views/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './_core/_services/auth.service';
import { RegisterComponent } from './views/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListsComponent } from './views/lists/lists.component';
import { MessagesComponent } from './views/messages/messages.component';
import { routes } from './routes';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { PreventUnsavedChanges } from './_core/_guards/profile/prevent-unsaved-changes-guard';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TokenInterceptorProvider } from './_core/_helpers/utilities/token-interceptor';
import { CustomPipesModule } from './_core/_helpers/pipes/custom-pipes.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HomeComponent } from './views/home/home.component';
import { HasRoleDirective } from './_core/_directives/has-role.directive';
export function tokenGetter() {
  return localStorage.getItem(LocalStorageContains.TOKEN);
}
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    ListsComponent,
    MessagesComponent,
    HomeComponent,
    HasRoleDirective,
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
    PaginationModule.forRoot(),
    CustomPipesModule,
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
    TokenInterceptorProvider,
    AuthGuard,
    PreventUnsavedChanges,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
