import { MessageConstants } from './../../../_core/_constants/message.enum';
import { NgxNotiflixService } from './../../../_core/_services/ngx-notiflix.service';
import { User } from './../../../_core/_models/user';
import { UserService } from './../../../_core/_services/user.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MemeberDetailComponent implements OnInit {
  user: User;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private notiflix: NgxNotiflixService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserFromMain();
  }

  back() {
    this.router.navigate(['members']);
  }

  getUserFromMain() {
    // this.notiflix.showLoading();
    this.userService.currentUser.subscribe({
      next: (res) => {
        if (Object.keys(res).length != 0) {
          this.user = res;
          this.notiflix.hideLoading();
        } else {
          this.back();
        }
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }

}
