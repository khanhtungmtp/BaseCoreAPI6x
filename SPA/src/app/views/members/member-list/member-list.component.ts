import { PaginationUtilities, PaginationParams } from './../../../_core/_helpers/utilities/pagination-utilities';
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
  pagination: PaginationUtilities
  paginationParams: PaginationParams
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
        this.users = data['users'].result
        this.pagination = data['users'].pagination
        this.notiflix.hideLoading();
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.getUsers();

  }
  getUsers() {
    this.notiflix.showLoading();
    this.paginationParams = { pageNumber: this.pagination.currentPage, pageSize: this.pagination.itemsPerPage }
    this.userService.getUsers(this.paginationParams).subscribe({
      next: (res) => {
        this.users = res.result;
        this.pagination = res.pagination;
        this.notiflix.hideLoading();
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }

}
