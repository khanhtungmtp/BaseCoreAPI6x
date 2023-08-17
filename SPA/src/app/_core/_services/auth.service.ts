import { User, UserForRegister, UserLogin } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageContains } from '../_constants/localStorageContains';
import { BehaviorSubject } from 'rxjs';
import { LoginModel } from '../_models/auth/login-model';
import { NgxNotiflixService } from './ngx-notiflix.service';
import { MessageConstants } from '../_constants/message.enum';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.apiUrl + 'Auth/';
  jwtHelper: JwtHelperService = new JwtHelperService();
  decodedToken: any;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  userSource = new BehaviorSubject<User | null>(null);
  public currentUser: UserLogin
  constructor(
    private http: HttpClient,
    private notiflix: NgxNotiflixService,
    private router: Router
  ) {
  }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: LoginModel) {
    return this.http.post<UserLogin>(this.baseUrl + 'Login', model).pipe(
      map((response: UserLogin) => {
        const user = response;
        if (user) {
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          localStorage.setItem(LocalStorageContains.TOKEN, user.token);
          localStorage.setItem(LocalStorageContains.USER, JSON.stringify(user));
          this.currentUser = user;
          this.changeMemberPhoto(this.currentUser.photoUrl as string);
        }
      })
    );
  }

  getDecodedToken(token: string) {
    return JSON.parse(token)
  }

  logOut() {
    localStorage.clear();
  }

  loggedIn() {
    const token: string = localStorage.getItem(LocalStorageContains.TOKEN) as string;
    // this.currentUser = localStorage.getItem(LocalStorageContains.USER) ? localStorage.getItem(LocalStorageContains.USER) : '';
    // return !(!this.currentUser || !token) || !this.jwtHelper.isTokenExpired(token);
    // const token: string = localStorage.getItem(LocalStorageContains.TOKEN) as string;
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  isLogin() {
    if (!this.loggedIn()) {
      this.notiflix.error(MessageConstants.PLEASE_LOGIN);
      this.router.navigate(['/'])
      return false;
    }
    return true;
  }

  isAdmin() {
    this.isLogin();
    const user = localStorage.getItem(LocalStorageContains.USER) ? JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string) : '';
    if (user.roles.includes('Admin'))
      return true;
    return false;
  }

  register(user: UserForRegister) {
    return this.http.post<UserForRegister>(this.baseUrl + 'Register', user);
  }
}
