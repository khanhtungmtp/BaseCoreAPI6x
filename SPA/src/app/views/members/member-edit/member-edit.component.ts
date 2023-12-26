import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
  userId: number;
  photoUrl: string = '../../../../assets/user.png';
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
          this.userId = res.id
        } else {
          this.router.navigate(['/']);
          this.spinner.hide();
        }
      },
      error: (e) => {
        throw e
      }
    })
    this.getUserData()
    this.authService.currentPhotoUrl.subscribe({
      next: (res) => {
        this.photoUrl = res;
      }, error: (e) => {
        throw e;
      }
    })
    this.spinner.hide();
  }

  getUserData() {
    this.spinner.show();
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: (res) => {
          if (res !== null) {
            this.user = res
            this.spinner.hide();
          } else {
            this.router.navigate(['/']);
            this.spinner.hide();
          }
        }, error: (e) => {
          throw e;
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
      }, error: (e) => {
        throw e;
      },
      complete: () => {
        this.getUserData();
        this.spinner.hide();
      }
    })
  }

}
