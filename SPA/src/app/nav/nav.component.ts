import { Router } from '@angular/router';
import { AuthService } from './../_core/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgxNotiflixService } from '../_core/_services/ngx-notiflix.service';
import { MessageConstants } from '../_core/_constants/message.enum';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}

  constructor(
    private authService: AuthService,
    private snotiflix: NgxNotiflixService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe({
      next: (res) => {
        this.snotiflix.success(MessageConstants.LOGGED_IN)
      }, error: () => {
        this.snotiflix.error(MessageConstants.LOGIN_FAILED);
      }, complete:() => {
        this.router.navigate(['/members']);
      },
    })
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logOut(){
    localStorage.clear();
    this.model = {}
    this.snotiflix.success(MessageConstants.LOGGED_OUT)
    this.router.navigate(['/home']);
  }

}
