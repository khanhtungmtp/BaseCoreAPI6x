import { AuthGuard } from './_core/_guards/auth/auth.guard';
import { RouterModule } from '@angular/router';
import { GlobalHttpInterceptorProvider } from './_core/_helpers/utilities/global-http-interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_core/_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListsComponent } from './views/lists/lists.component';
import { MemberListComponent } from './views/members/member-list/member-list.component';
import { MessagesComponent } from './views/messages/messages.component';
import { routes } from './routes';
import { UserService } from './_core/_services/user.service';
import { MemberCardComponent } from './views/members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
export function tokenGetter(){
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [				
    AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      ListsComponent,
      MemberListComponent,
      MessagesComponent,
      MemberCardComponent,
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
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
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
