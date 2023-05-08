import { PreventUnsavedChanges } from './_core/_guards/profile/prevent-unsaved-changes-guard';
import { AuthGuard } from './_core/_guards/auth/auth.guard';
import { ListsComponent } from './views/lists/lists.component';
import { MessagesComponent } from './views/messages/messages.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { MemberEditComponent } from './views/members/member-edit/member-edit.component';
import { AuthService } from './_core/_services/auth.service';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    //canActivate: [AuthGuard],
    canActivate: [() => inject(AuthService).loggedIn()],
    children: [
      {
        path: 'members',
        loadChildren: () => import('./views/members/members.module').then(m => m.MembersModule)
      },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChanges] }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
