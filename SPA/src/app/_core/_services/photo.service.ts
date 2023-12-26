import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  baseUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }
  setMainPhoto(userId: number, photoId: number) {
    //https://localhost:7215/api/users/2/Photos/8/isMain
    return this.http.post(this.baseUrl + 'users/' + userId + '/Photos/' + photoId + '/isMain', {})
  }

  deletePhoto(userId: number, photoId: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/Photos/' + photoId);
  }
}
