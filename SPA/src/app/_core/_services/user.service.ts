import { UserFilter, UserLogin } from './../_models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PaginationParams } from '../_helpers/utilities/pagination-utilities';
import { OperationResult } from '../_helpers/utilities/operationResult';
import { SearchParams } from '../_models/dating';
import { PaginationResult } from './../_helpers/utilities/pagination-utilities';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl: string = environment.apiUrl + 'User/'
  // rxjs
  userSource = new BehaviorSubject<UserLogin>({} as UserLogin)
  currentUser = this.userSource.asObservable();
  // sinal angular 16
  searchParam: SearchParams = <SearchParams>{};
  searchInput = signal<SearchParams>(this.searchParam);
  constructor(
    private http: HttpClient
  ) { }

  getUsersLike(paginationParam?: PaginationParams, likeParam?: any) {
    let params = new HttpParams();
    if (paginationParam?.pageNumber != null && paginationParam.pageSize != null) {
      params = params.appendAll({ ...paginationParam });
    }
    if (likeParam === 'Likers') {
      params = params.append('likers', true);
    }
    if (likeParam === 'Likees') {
      params = params.append('likees', true);
    }
    return this.http.get<PaginationResult<User>>(this.baseUrl + 'GetUserLikes', { params: params });
  }

  getUsers(paginationParam?: PaginationParams, userFilter?: UserFilter, likeParam?: any) {
    let params = new HttpParams();
    if (paginationParam?.pageNumber != null && paginationParam.pageSize != null) {
      params = params.appendAll({ ...paginationParam });
    }
    if (userFilter != null)
      params = params.appendAll({ ...userFilter });
    if (likeParam === 'Likers')
      params = params.append('likers', true);
    if (likeParam === 'Likees')
      params = params.append('likees', true);

    return this.http.get<PaginationResult<User>>(this.baseUrl, { params: params });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(this.baseUrl + id, user);
  }

  sendLike(userId: number, recipient: number) {
    return this.http.post<OperationResult>(this.baseUrl + userId + '/like/' + recipient, {});
  }

}
