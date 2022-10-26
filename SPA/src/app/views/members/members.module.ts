import { FormsModule } from '@angular/forms';
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
import { MemberEditComponent } from './member-edit/member-edit.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
@NgModule({
  declarations: [
    MemberCardComponent,
    MemberListComponent,
    MemeberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    FileUploadModule,
  ],
  providers: [
    MemberDetailResolver,
    MemberListResolver,
    UserService
  ]
})
export class MembersModule { }
