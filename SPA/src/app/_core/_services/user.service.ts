import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PaginationParams, PaginationResult } from '../_helpers/utilities/pagination-utilities';

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
  getUsers(paginationParam?: PaginationParams): Observable<PaginationResult<User[]>> {
    let params = new HttpParams();
    if (paginationParam?.pageNumber != null && paginationParam.pageSize != null) {
      params = params.appendAll({ ...paginationParam });
    }
    return this.http.get<PaginationResult<User[]>>(this.baseUrl, { params: params });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(this.baseUrl + id, user);
  }

}
