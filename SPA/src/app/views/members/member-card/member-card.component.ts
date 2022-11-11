import { Router } from '@angular/router';
import { MessageConstants } from 'src/app/_core/_constants/message.enum';
import { NgxNotiflixService } from './../../../_core/_services/ngx-notiflix.service';
import { UserService } from 'src/app/_core/_services/user.service';
import { User } from './../../../_core/_models/user';
import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user!: User;
  userLogin: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
  constructor(
    private userService: UserService,
    private notiflix: NgxNotiflixService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  sendLike(recipient: number) {
    this.userService.sendLike(this.userLogin.id, recipient).subscribe({
      next: () => {
        this.notiflix.success('You have liked: ' + this.user.username);
      },
      error: (err) => {
        this.notiflix.error(err);
      }
    })
  }

  redirectDetail(user: User) {
    this.userService.userSource.next(user);
    this.router.navigate(['/members/' + user.id]);

  }

}
