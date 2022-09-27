import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageContains } from '../_constants/localStorageContains';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.apiUrl + 'Auth/';
  jwtHelper: JwtHelperService = new JwtHelperService();
  decodedToken: any;
  currentUser: User = <User>{};
  constructor(
    private http: HttpClient
  ) {  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'Login', model).pipe(
      map((res: any) => {
        const user = res;
        if (user) {
          localStorage.setItem(LocalStorageContains.TOKEN, user.token);
          localStorage.setItem(LocalStorageContains.USER, user.user);
          this.decodedToken = this.jwtHelper.decodeToken(user.token)  
          this.currentUser = user.user;     
        }
      }),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  loggedIn() {
    const token: string= localStorage.getItem(LocalStorageContains.TOKEN) as string;
    const user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
    return !(!user || !token) || !this.jwtHelper.isTokenExpired(token);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'Register', model);
  }
}
