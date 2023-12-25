import { CaptionConstants, MessageConstants } from './../../_constants/message.enum';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { NgSnotifyService } from '../../_services/ng-snotify.service';

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
    private snotify: NgSnotifyService
  ) {
  }
  canActivate(): boolean {
    if(this.authService.loggedIn()){
      return true;
    }
    this.snotify.error(CaptionConstants.ERROR, MessageConstants.PLEASE_LOGIN);
    this.router.navigate(['/'])
    return false;
  }
}
