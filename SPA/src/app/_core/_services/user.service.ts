import { UserFilter } from './../_models/user';
import { map } from 'rxjs/operators';
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
  getUsers(paginationParam?: PaginationParams, userFilter?: UserFilter) {
    let paginatedResult: PaginationResult<User[]> = <PaginationResult<User[]>>{};
    let params = new HttpParams();
    if (paginationParam?.pageNumber != null && paginationParam.pageSize != null) {
      params = params.appendAll({ ...paginationParam });
    }
    if (userFilter != null) {
      // or append('gender', userFilter.gender)
      params = params.appendAll({ ...userFilter });
    }
    return this.http.get<User[]>(this.baseUrl, { observe: 'response', params: params }).pipe(
      map(response => {
        paginatedResult.result = response.body as User[];
        if (response.headers.get('pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination') as string);
        }
        return paginatedResult;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put<User>(this.baseUrl + id, user);
  }

}
