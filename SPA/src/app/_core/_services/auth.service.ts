import { User } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageContains } from '../_constants/localStorageContains';
import { BehaviorSubject } from 'rxjs';
import { LoginModel } from '../_models/auth/login-model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.apiUrl + 'Auth/';
  jwtHelper: JwtHelperService = new JwtHelperService();
  decodedToken: any;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  public currentUser: User
  constructor(
    private http: HttpClient
  ) {
  }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: LoginModel) {
    return this.http.post<LoginModel>(this.baseUrl + 'Login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem(LocalStorageContains.TOKEN, user.token);
          localStorage.setItem(LocalStorageContains.USER, JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photo_url as string);
        }
      })
    );
  }

  logOut() {
    localStorage.clear();
  }

  loggedIn() {
    const token: string = localStorage.getItem(LocalStorageContains.TOKEN) as string;
    // this.currentUser = localStorage.getItem(LocalStorageContains.USER) ? localStorage.getItem(LocalStorageContains.USER) : '';
    // return !(!this.currentUser || !token) || !this.jwtHelper.isTokenExpired(token);
    // const token: string = localStorage.getItem(LocalStorageContains.TOKEN) as string;
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(user: User) {
    return this.http.post<User>(this.baseUrl + 'Register', user);
  }
}
