import { AuthService } from './../_core/_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe({
      next: (res) => {
        console.log('login successfully');
      }, error: () => {
        console.log('Failed to login');

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
