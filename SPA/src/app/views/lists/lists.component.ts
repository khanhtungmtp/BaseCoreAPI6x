import { User } from './../../_core/_models/user';
import { PaginationUtilities } from './../../_core/_helpers/utilities/pagination-utilities';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_core/_services/user.service';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaptionConstants } from 'src/app/_core/_constants/message.enum';

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
    private snotify: NgSnotifyService,
    private spinner: NgxSpinnerService
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

    this.spinner.show();
    this.userService.getUsersLike(this.pagination, this.likesParam).subscribe({
      next: (res) => {
        this.users = res.result;
        this.pagination = res.pagination;
        this.spinner.hide();
      }, error: (err) => {
        this.snotify.error(CaptionConstants.ERROR, err);
        this.spinner.hide();
      }
    })
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event.page;
    this.loadUsers();
  }

}
