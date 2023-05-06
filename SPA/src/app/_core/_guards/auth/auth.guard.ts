import { MessageConstants } from './../../_constants/message.enum';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { NgxNotiflixService } from '../../_services/ngx-notiflix.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard  {
  /**
   *
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private notiflix: NgxNotiflixService
  ) {
  }
  canActivate(): boolean {
    if(this.authService.loggedIn()){
      return true;
    }
    this.notiflix.error(MessageConstants.PLEASE_LOGIN);
    this.router.navigate(['/'])
    return false;
  }
}
