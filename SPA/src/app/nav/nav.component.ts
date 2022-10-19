import { Router } from '@angular/router';
import { AuthService } from './../_core/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgxNotiflixService } from '../_core/_services/ngx-notiflix.service';
import { MessageConstants } from '../_core/_constants/message.enum';
import { User } from '../_core/_models/user';
import { UserService } from '../_core/_services/user.service';
import { LoginModel } from '../_core/_models/auth/login-model';
import { LocalStorageContains } from '../_core/_constants/localStorageContains';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  currentUser: any;
  loginForms: LoginModel = {
    username: '',
    password: '',
  };
  user: User;
  constructor(
    public authService: AuthService,
    private notiflix: NgxNotiflixService,
    private router: Router,
    private userService: UserService
  ) {
    this.user = localStorage.getItem(LocalStorageContains.USER) ? JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string) : '';
  }

  ngOnInit() {
  }


  editProfile(user: User) {
    this.userService.userSource.next(user);
    this.router.navigate(['member/edit']);
  }

  login() {
    this.authService.login(this.loginForms).subscribe({
      next: () => {
        this.user = localStorage.getItem(LocalStorageContains.USER) ? JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string) : '';
        this.notiflix.success(MessageConstants.LOGGED_IN)
      }, error: () => {
        this.notiflix.error(MessageConstants.LOGIN_FAILED);
      },
      complete: () => {
        this.router.navigate(['/members']);
      },
    })
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logOut() {
    this.authService.logOut();
    this.loginForms = {
      username: '',
      password: ''
    }
    this.notiflix.success(MessageConstants.LOGGED_OUT)
    this.router.navigate(['/']);
  }

}
