import { LocalStorageContains } from './../../../_core/_constants/localStorageContains';
import { PaginationUtilities, PaginationParams } from './../../../_core/_helpers/utilities/pagination-utilities';
import { ActivatedRoute } from '@angular/router';
import { MessageConstants } from '../../../_core/_constants/message.enum';
import { NgxNotiflixService } from '../../../_core/_services/ngx-notiflix.service';
import { User, UserFilter } from '../../../_core/_models/user';
import { UserService } from '../../../_core/_services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
  userFilter: UserFilter = <UserFilter>{
    min_age: 18,
    max_age: 60
  }
  pagination: PaginationUtilities
  paginationParams: PaginationParams
  genderList = [
    { key: 'male', value: 'Male' },
    { key: 'female', value: 'Female' },
  ]
  ageList() {
    let ageArr = [];
    for (let index = 18; index < 100; index++) {
      ageArr.push(index);
    }
    return ageArr;
  }

  constructor(
    private userService: UserService,
    private notiflix: NgxNotiflixService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.userFilter.gender = this.user.gender == 'Male' ? 'Female' : 'Male';
  }

  resetFilter() {
    this.userFilter.min_age = 18;
    this.userFilter.max_age = 60;
    this.userFilter.gender = this.user.gender == 'Male' ? 'Female' : 'Male';
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
    this.userService.getUsers(this.paginationParams, this.userFilter).subscribe({
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
