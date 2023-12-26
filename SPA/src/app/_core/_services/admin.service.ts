import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListRoles } from '../_models/admin/roles';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl: string = environment.apiUrl + 'Admin/';
  constructor(private http: HttpClient) { }
  getUserWithRole() {
    return this.http.get<ListRoles[]>(this.baseUrl + 'users-with-roles');
  }

  updateUserWithRoles(userName: string, roles: string[]) {
    return this.http.post<string[]>(this.baseUrl + 'edit-roles/' + userName + '?roles=' + roles, {});
  }
}
