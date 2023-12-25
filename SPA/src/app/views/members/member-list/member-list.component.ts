import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { PaginationUtilities } from 'src/app/_core/_helpers/utilities/pagination-utilities';
import { MessageConstants, CaptionConstants } from 'src/app/_core/_constants/message.enum';

import { User, UserFilter } from 'src/app/_core/_models/user';
import { UserService } from 'src/app/_core/_services/user.service';
import { AfterContentChecked, Component, OnInit, computed, effect } from '@angular/core';
import { SearchParams } from 'src/app/_core/_models/dating';
import { DatingContains } from 'src/app/_core/_constants/datingContains';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, AfterContentChecked {
  user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string) ?? '';
  userFilter: UserFilter = <UserFilter>{
    min_age: DatingContains.MIN_AGE,
    max_age: DatingContains.MAX_AGE,
    gender: this.user.gender === 'male' ? 'female' : 'male',
    order_by: 'last_active'
  }
  users: User[] = [];
  searchParam: SearchParams = <SearchParams>{
    min_age: this.userFilter.min_age,
    max_age: this.userFilter.max_age,
    gender: this.userFilter.gender,
    order_by: this.userFilter.order_by
  };
  // signal angular 16
  getParamSearch = computed(() => {
    return this.userService.searchInput()
  })
  pagination: PaginationUtilities = <PaginationUtilities>{
    pageNumber: 1,
    pageSize: 6,
  }
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
    private snotify: NgSnotifyService,
    private spinner: NgxSpinnerService,
  ) {
    // using effect function
    // effect(() => {
    //   console.log('this.userService.searchInput(): ', this.userService.searchInput());
    //   if (Object.values(this.userService.searchInput()).length != 0) {
    //     this.userFilter = this.userService.searchInput()

    //   }
    // })
  }

  trackByidFn(index: number, item: User) {
    return index;
  }

  ngOnInit(): void {
    console.log(' this.userFilter ngOnInit: ', this.userFilter);
    // using computed function
    if (Object.values(this.getParamSearch()).length != 0)
      this.userFilter = this.getParamSearch();
    this.getUsers();

  }

  ngAfterContentChecked(): void {
    // lấy những parameter mới nhất khi changes
    this.searchParam = <SearchParams>{
      min_age: this.userFilter.min_age,
      max_age: this.userFilter.max_age,
      gender: this.userFilter.gender,
      order_by: this.userFilter.order_by
    };
  }

  resetFilter() {
    this.userFilter.min_age = DatingContains.MIN_AGE;
    this.userFilter.max_age = DatingContains.MAX_AGE;
    this.userFilter.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userFilter.order_by = 'last_active';
    this.getUsers();
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event.page;
    this.getUsers();
  }
  getUsers() {
    this.spinner.show();
    this.userService.getUsers(this.pagination, this.userFilter).subscribe({
      next: (res) => {
        this.users = res.result;
        this.pagination = res.pagination;
        this.spinner.hide();
      }, error: () => {
        this.snotify.error(CaptionConstants.ERROR,MessageConstants.SYSTEM_ERROR_MSG);
        this.spinner.hide();
      }
    })
  }

}
