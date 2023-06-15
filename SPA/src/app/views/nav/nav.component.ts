import { Router } from '@angular/router';
import { AuthService } from 'src/app/_core/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgxNotiflixService } from 'src/app/_core/_services/ngx-notiflix.service';
import { MessageConstants } from 'src/app/_core/_constants/message.enum';
import { UserLogin } from 'src/app/_core/_models/user';
import { UserService } from 'src/app/_core/_services/user.service';
import { LoginModel } from 'src/app/_core/_models/auth/login-model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loginForms: LoginModel = {
    username: '',
    password: '',
  };
  photo_url: string;
  constructor(
    public authService: AuthService,
    private notiflix: NgxNotiflixService,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe({
      next: (res) => {
        this.photo_url = res
      }, error: () => {
        this.notiflix.error('Get current photo url error');
      }
    });
  }



  editProfile(user: UserLogin) {
    this.userService.userSource.next(user);
    this.router.navigate(['member/edit']);
  }

  login() {
    this.authService.login(this.loginForms).subscribe({
      next: () => {
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

  isAdmin() {
    return this.authService.isAdmin();
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
