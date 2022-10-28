import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl: string = environment.apiUrl + 'User/'
  userSource = new BehaviorSubject<User>({} as User)
  currentUser = this.userSource.asObservable();
  constructor(
    private http: HttpClient
  ) { }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(this.baseUrl + id, user);
  }

}
