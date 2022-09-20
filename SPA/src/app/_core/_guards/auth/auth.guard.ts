import { MessageConstants } from './../../_constants/message.enum';
import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { NgxNotiflixService } from '../../_services/ngx-notiflix.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
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
    this.router.navigate(['/home'])
    return false;
  }
}
