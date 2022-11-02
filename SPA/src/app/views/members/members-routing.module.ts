import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberDetailResolver } from 'src/app/_core/_resolvers/member-detail.resolver';
import { MemberListResolver } from 'src/app/_core/_resolvers/member-list.resolver';
import { MemberListComponent } from './member-list/member-list.component';
import { MemeberDetailComponent } from './memeber-detail/memeber-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MemberListComponent,
    resolve: { users: MemberListResolver }

  },
  {
    path: ':id',
    component: MemeberDetailComponent,
    data: {
      title: 'Detail member'
    },
    resolve: { user: MemberDetailResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
