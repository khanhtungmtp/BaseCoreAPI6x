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
import { MemberListComponent } from './views/member-list/member-list.component';
import { MessagesComponent } from './views/messages/messages.component';
import { routes } from './routes';
@NgModule({
  declarations: [				
    AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      ListsComponent,
      MemberListComponent,
      MessagesComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    GlobalHttpInterceptorProvider,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
