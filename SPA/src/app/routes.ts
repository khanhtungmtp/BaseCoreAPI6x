import { PreventUnsavedChanges } from './_core/_guards/profile/prevent-unsaved-changes-guard';
import { ListsComponent } from './views/lists/lists.component';
import { MessagesComponent } from './views/messages/messages.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { MemberEditComponent } from './views/members/member-edit/member-edit.component';
import { AuthService } from './_core/_services/auth.service';
import { HomeComponent } from './views/home/home.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [() => inject(AuthService).isLogin()],
    children: [
      {
        path: 'members',
        loadChildren: () => import('./views/members/members.module').then(m => m.MembersModule)
      },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChanges] },
      { path: 'admin', loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule), canActivate: [() => inject(AuthService).isAdmin()] }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
