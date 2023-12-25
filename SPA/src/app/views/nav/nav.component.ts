import { Router } from '@angular/router';
import { AuthService } from 'src/app/_core/_services/auth.service';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CaptionConstants, MessageConstants } from 'src/app/_core/_constants/message.enum';
import { UserLogin } from 'src/app/_core/_models/user';
import { UserService } from 'src/app/_core/_services/user.service';
import { LoginModel } from 'src/app/_core/_models/auth/login-model';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { LangConstants } from 'src/app/_core/_constants/langs.constants';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loginForms: LoginModel = {
    username: '',
    password: '',
  };
  photo_url: string;
  isAdmin: string[] = ["Admin", "SuperAdmin"];
  lang: string | null = localStorage.getItem(LocalStorageContains.LANG);
  destroyRef = inject(DestroyRef);
  langConstants: typeof LangConstants = LangConstants;
  constructor(
    public authService: AuthService,
    private snotify: NgSnotifyService,
    private router: Router,
    private userService: UserService,
    private translateServices: TranslateService
  ) {
  }

  ngOnInit() {
    if (!this.lang)
      localStorage.setItem(LocalStorageContains.LANG, LangConstants.VI);
    this.translateServices.use(this.lang as string);
    this.authService.currentPhotoUrl.subscribe({
      next: (res) => {
        this.photo_url = res
      }, error: () => {
        this.snotify.error(CaptionConstants.ERROR, 'Get current photo url error');
      }
    });
  }

  switchLang(lang: string) {
    this.translateServices.use(lang);
    localStorage.setItem(LocalStorageContains.LANG, lang);
  }

  editProfile(user: UserLogin) {
    this.userService.userSource.next(user);
    this.router.navigate(['member/edit']);
  }

  login() {
    this.authService.login(this.loginForms).subscribe({
      next: () => {
        this.snotify.success(CaptionConstants.SUCCESS, MessageConstants.LOGGED_IN)
      }, error: (e) => {
        throw e;
        // this.snotify.error(CaptionConstants.ERROR,e);
      },
      complete: () => {
        this.router.navigate(['/members']);
      },
    })
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  // isAdmin() {
  //   return this.authService.isAdmin();
  // }

  logOut() {
    this.authService.logOut();
    this.loginForms = {
      username: '',
      password: ''
    }
    this.snotify.success(CaptionConstants.SUCCESS, MessageConstants.LOGGED_OUT)
    this.router.navigate(['/']);
  }

}
