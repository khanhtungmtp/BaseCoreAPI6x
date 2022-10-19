import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageConstants } from 'src/app/_core/_constants/message.enum';
import { User } from 'src/app/_core/_models/user';
import { AuthService } from 'src/app/_core/_services/auth.service';
import { NgxNotiflixService } from 'src/app/_core/_services/ngx-notiflix.service';
import { UserService } from 'src/app/_core/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User = <User>{}
  userid: number;
  @ViewChild('editForm') editForm: NgForm

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   if (this.editForm.dirty) {
  //     $event.returnValue = true;
  //   }
  // }
  constructor(
    private notiflix: NgxNotiflixService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.userService.currentUser.subscribe({
      next: (res) => {
        if (Object.keys(res).length != 0) {
          this.userid = res.id
        } else {
          this.router.navigate(['/']);
          this.notiflix.hideLoading();
        }
      },
      error: () => {
        console.log(1);

        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
    this.getUserData()
    this.notiflix.hideLoading();
  }

  getUserData() {
    this.notiflix.showLoading();
    if (this.userid) {
      this.userService.getUser(this.userid).subscribe({
        next: (res) => {
          if (res !== null) {
            this.user = res
            this.notiflix.hideLoading();
            //}
          } else {
            this.router.navigate(['/']);
            this.notiflix.hideLoading();
          }
        }, error: () => {
          this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
          this.notiflix.hideLoading();
        }
      });
    }
  }

  updateUser() {
    this.notiflix.showLoading();
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.notiflix.success(MessageConstants.UPDATED_OK_MSG);
        this.editForm.reset(this.user);
        this.notiflix.hideLoading();
      },
      error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    })
  }



}
