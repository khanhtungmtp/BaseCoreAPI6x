import { ActivatedRoute } from '@angular/router';
import { MessageConstants } from '../../../_core/_constants/message.enum';
import { NgxNotiflixService } from '../../../_core/_services/ngx-notiflix.service';
import { User } from '../../../_core/_models/user';
import { UserService } from '../../../_core/_services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  constructor(
    private userService: UserService,
    private notiflix: NgxNotiflixService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.notiflix.showLoading();
    this.route.data.subscribe({
      next: (data) => {
        this.users = data['users']
        this.notiflix.hideLoading();
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }
  // loadUsers(){
  //   this.userService.getUsers().subscribe({
  //     next: (users: User[]) => {
  //       this.users = users
  //     },error:() => {
  //       this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG)
  //     }
  //   })
  // }

}