import { User } from './../../_core/_models/user';
import { PaginationUtilities } from './../../_core/_helpers/utilities/pagination-utilities';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_core/_services/user.service';
import { NgxNotiflixService } from 'src/app/_core/_services/ngx-notiflix.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  likesParam: string;
  pagination: PaginationUtilities = <PaginationUtilities>{
    pageNumber: 1,
    pageSize: 6
  };
  users: User[] = [];
  constructor(
    private userService: UserService,
    private notiflix: NgxNotiflixService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(likesParam?: string) {
    if (likesParam == undefined) {
      this.likesParam = 'Likers';
    } else {
      this.likesParam = likesParam
    }

    this.notiflix.showLoading();
    this.userService.getUsersLike(this.pagination, this.likesParam).subscribe({
      next: (res) => {
        this.users = res.result;
        this.pagination = res.pagination;
        this.notiflix.hideLoading();
      }, error: (err) => {
        this.notiflix.error(err);
        this.notiflix.hideLoading();
      }
    })
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event.page;
    this.loadUsers();
  }

}
