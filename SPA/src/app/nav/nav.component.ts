import { AuthService } from './../_core/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgxNotiflixService } from '../_core/_services/ngx-notiflix.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}

  constructor(
    private authService: AuthService,
    private snotiflix: NgxNotiflixService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe({
      next: (res) => {
        this.snotiflix.success('Login successfully')
      }, error: () => {
        this.snotiflix.error('Failed to login');
      }
    })
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !!token; // tip convert boolean
  }

  logOut(){
    localStorage.removeItem('token');
  }

}
