import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.apiUrl + 'Auth/';
  constructor(
    private http: HttpClient
  ) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'Login', model).pipe(
      map((res: any) => {
        const user = res;
        if (user) {
          localStorage.setItem('token', user.token);
        }
      })
    );
  }
}
