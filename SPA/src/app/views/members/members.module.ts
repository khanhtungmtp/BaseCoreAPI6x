import { MemberListComponent } from './member-list/member-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MembersRoutingModule } from './members-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MemberDetailResolver } from 'src/app/_core/_resolvers/member-detail.resolver';
import { MemberListResolver } from 'src/app/_core/_resolvers/member-list.resolver';
import { MemberCardComponent } from './member-card/member-card.component';
import { MemeberDetailComponent } from './memeber-detail/memeber-detail.component';
import { UserService } from 'src/app/_core/_services/user.service';

@NgModule({
  declarations: [
    MemberCardComponent,
    MemberListComponent,
    MemeberDetailComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
  ], 
  providers: [
    MemberDetailResolver,
    MemberListResolver,
    UserService,
  ]
})
export class MembersModule { }
