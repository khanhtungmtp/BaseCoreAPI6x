import { Router } from '@angular/router';

import { UserService } from 'src/app/_core/_services/user.service';
import { User } from 'src/app/_core/_models/user';
import { Component, Input, OnInit, computed, effect } from '@angular/core';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { SearchParams } from 'src/app/_core/_models/dating';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaptionConstants } from 'src/app/_core/_constants/message.enum';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  searchParam: SearchParams = <SearchParams>{};
  @Input({ required: true }) user: User;
  @Input() params: SearchParams;
  test = computed(() => {
    this.searchParam = this.userService.searchInput()
    return this.searchParam;
  })
  userLogin: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string) ?? '';
  constructor(
    private userService: UserService,
    private snotify: NgSnotifyService,
    private spinner:NgxSpinnerService,
    private router: Router
  ) {
  }

  ngOnInit(): void { }

  sendLike(recipient: number) {
    this.userService.sendLike(this.userLogin.id, recipient).subscribe({
      next: (res) => {
        this.snotify.success(CaptionConstants.SUCCESS, `You have ${res.message}: ` + this.user.username);
      },
      error: (err) => {
        this.snotify.error(CaptionConstants.ERROR,err);
      }
    })
  }

  redirectDetail(user: User) {
    this.searchParam = {
      min_age: this.params.min_age,
      max_age: this.params.max_age,
      gender: this.params.gender,
      order_by: this.params.order_by
    }
    this.userService.searchInput.set(this.searchParam);
    this.router.navigate(['/members/' + user.id]);
  }

}
