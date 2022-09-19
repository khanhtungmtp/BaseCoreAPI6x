
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageConstants } from '../_core/_constants/message.enum';
import { AuthService } from '../_core/_services/auth.service';
import { NgxNotiflixService } from '../_core/_services/ngx-notiflix.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {}
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();
  constructor(
    private authService: AuthService,
    private snotiflix: NgxNotiflixService
  ) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe({
      next: (res) => {
        this.snotiflix.success(MessageConstants.CREATED_OK_MSG)
      }, error: () => {
        this.snotiflix.error(MessageConstants.CREATED_ERROR_MSG)
      }
    });
  }
  cancel() {
    this.cancelRegister.emit(false)
  }

}
