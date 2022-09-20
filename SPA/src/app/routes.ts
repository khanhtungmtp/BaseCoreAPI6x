import { AuthGuard } from './_core/_guards/auth/auth.guard';
import { ListsComponent } from './views/lists/lists.component';
import { MessagesComponent } from './views/messages/messages.component';
import { MemberListComponent } from './views/member-list/member-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent},
            { path: 'messages', component: MessagesComponent},
            { path: 'lists', component: ListsComponent}
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule { }
