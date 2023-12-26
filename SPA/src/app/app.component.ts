import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLogin } from './_core/_models/user';
import { AuthService } from './_core/_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SPA';
  jwtHelper = new JwtHelperService();
  constructor(private authService: AuthService) { }

  ngOnInit() {
    const token = localStorage.getItem(LocalStorageContains.TOKEN);
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    const user: UserLogin = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl as string);
    }
  }
}
