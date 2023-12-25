import { LocalStorageContains } from './_core/_constants/localStorageContains';
import { AuthGuard } from './_core/_guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { GlobalHttpInterceptorProvider } from './_core/_helpers/utilities/global-http-interceptor';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { NgxTrimInputDirective } from './_core/_directives/ngx-trim-input.directive';
import { NumberOnlyDirective } from './_core/_directives/number-only.directive';
import { GlobalErrorHandlerService } from './_core/_services/globalerrorhandler.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-alt-snotify';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
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
    NgxTrimInputDirective,
    NumberOnlyDirective
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
    SnotifyModule,
    NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage:'vi'
    }),
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
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    TokenInterceptorProvider,
    SnotifyService,
    AuthGuard,
    PreventUnsavedChanges,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
