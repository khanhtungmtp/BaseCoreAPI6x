import { MemberDetailResolver } from './_core/_resolvers/member-detail.resolver';
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
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ListsComponent } from './views/lists/lists.component';
import { MemberListComponent } from './views/members/member-list/member-list.component';
import { MessagesComponent } from './views/messages/messages.component';
import { routes } from './routes';
import { UserService } from './_core/_services/user.service';
import { MemberCardComponent } from './views/members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MemeberDetailComponent } from './views/members/memeber-detail/memeber-detail.component';
import { MemberListResolver } from './_core/_resolvers/member-list.resolver';
import { GalleryModule } from  'ng-gallery';
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
      MemeberDetailComponent,
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(routes),
    GalleryModule,
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
    UserService,
    MemberDetailResolver,
    MemberListResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
