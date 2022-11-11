import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { MemeberDetailComponent } from './memeber-detail/memeber-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MemberListComponent
  },
  {
    path: ':id',
    component: MemeberDetailComponent,
    data: {
      title: 'Detail member'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
