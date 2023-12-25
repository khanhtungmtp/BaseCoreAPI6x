import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  baseUrl: string = environment.apiUrl;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  setMainPhoto(userid: number, photoid: number) {
    //https://localhost:7215/api/users/2/Photos/8/isMain
    return this.http.post(this.baseUrl + 'users/' + userid + '/Photos/' + photoid + '/isMain', {})
  }

  deletePhoto(userid: number, photoid: number) {
    return this.http.delete(this.baseUrl + 'users/' + userid + '/Photos/' + photoid);
  }
}
