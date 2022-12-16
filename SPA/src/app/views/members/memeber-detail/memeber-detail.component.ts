import { MessageConstants } from './../../../_core/_constants/message.enum';
import { NgxNotiflixService } from './../../../_core/_services/ngx-notiflix.service';
import { User } from './../../../_core/_models/user';
import { UserService } from './../../../_core/_services/user.service';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
@Component({
  selector: 'app-memeber-detail',
  templateUrl: './memeber-detail.component.html',
  styleUrls: ['./memeber-detail.component.css']
})

export class MemeberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: false }) memberTabs: TabsetComponent;
  user: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private notiflix: NgxNotiflixService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.notiflix.showLoading();
    this.route.data.subscribe(data => this.user = data['user']);
    this.route.queryParams.subscribe({
      next: (res) => {
        let tabId = parseInt(res['tab']);
        console.log(this.memberTabs);

        if (this.memberTabs?.tabs[tabId]) {
          this.memberTabs.tabs[tabId].active = true;
        }
        this.notiflix.hideLoading()
      },
      error: () => this.notiflix.error('cannot get params'),
      complete: () => this.notiflix.hideLoading()
    })

  }

  back() {
    this.router.navigate(['members']);
  }

  selectTab(tabId: number) {
    if (this.memberTabs?.tabs[tabId]) {
      this.memberTabs.tabs[tabId].active = true;
    }
  }

}
