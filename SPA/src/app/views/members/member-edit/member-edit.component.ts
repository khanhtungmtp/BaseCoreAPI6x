import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaptionConstants, MessageConstants } from 'src/app/_core/_constants/message.enum';
import { User } from 'src/app/_core/_models/user';
import { AuthService } from 'src/app/_core/_services/auth.service';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';

import { UserService } from 'src/app/_core/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User = <User>{}
  userid: number;
  photo_url: string = '../../../../assets/user.png';
  defaultImage: string = '../../../../assets/user_default.png';
  @ViewChild('editFrofile') editFrofile: NgForm

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editFrofile.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private snotify: NgSnotifyService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.userService.currentUser.subscribe({
      next: (res) => {
        if (res) {
          this.userid = res.id
        } else {
          this.router.navigate(['/']);
          this.spinner.hide();
        }
      },
      error: () => {
        this.snotify.error(CaptionConstants.ERROR, MessageConstants.SYSTEM_ERROR_MSG);
        this.spinner.hide();
      }
    })
    this.getUserData()
    this.authService.currentPhotoUrl.subscribe({
      next: (res) => {
        this.photo_url = res;
      }, error: () => {
        this.snotify.error(CaptionConstants.ERROR, MessageConstants.SYSTEM_ERROR_MSG);
      }
    })
    this.spinner.hide();
  }

  getUserData() {
    this.spinner.show();
    if (this.userid) {
      this.userService.getUser(this.userid).subscribe({
        next: (res) => {
          if (res !== null) {
            this.user = res
            this.spinner.hide();
          } else {
            this.router.navigate(['/']);
            this.spinner.hide();
          }
        }, error: () => {
          this.snotify.error(CaptionConstants.ERROR, MessageConstants.SYSTEM_ERROR_MSG);
          this.spinner.hide();
        }
      });
    }
  }

  updateUser() {
    this.spinner.show();
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.snotify.success(CaptionConstants.SUCCESS, MessageConstants.UPDATED_OK_MSG);
        this.editFrofile.resetForm();
        this.spinner.hide();
      },
      error: () => {
        this.snotify.error(CaptionConstants.ERROR, MessageConstants.SYSTEM_ERROR_MSG);
        this.spinner.hide();
      },
      complete: () => {
        this.getUserData();
        this.spinner.hide();
      }
    })
  }

}
