import { MessageConstants } from './../../../_core/_constants/message.enum';
import { NgxNotiflixService } from './../../../_core/_services/ngx-notiflix.service';
import { User } from './../../../_core/_models/user';
import { UserService } from './../../../_core/_services/user.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MemeberDetailComponent implements OnInit {
  user: User = <User>{};
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private notiflix: NgxNotiflixService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }


  loadUser() {
    this.notiflix.showLoading();
    this.route.data.subscribe({
      next: (data) => {
        this.user = data['user']
        this.notiflix.hideLoading();
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }

}
