import { Router } from '@angular/router';
import { LoginModel } from './../_core/_models/auth/login-model';
import { User } from './../_core/_models/user';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MessageConstants } from '../_core/_constants/message.enum';
import { AuthService } from '../_core/_services/auth.service';
import { NgxNotiflixService } from '../_core/_services/ngx-notiflix.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = <User>{};
  loginModel: LoginModel;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>
  @Output() cancelRegister = new EventEmitter();
  constructor(
    private authService: AuthService,
    private snotiflix: NgxNotiflixService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    }
    this.registerForms();
  }

  registerForms() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: new FormControl('', Validators.required),
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)])
    },
      { validator: this.passwordMatchValidator }
    )
  }

  passwordMatchValidator(fg: AbstractControl) {
    return fg.get('password')?.value === fg.get('confirmpassword')?.value ? null : { notmatched: true }
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe({
        next: () => {
          this.snotiflix.success(MessageConstants.CREATED_OK_MSG);
        }, error: () => {
          this.snotiflix.error(MessageConstants.CREATED_ERROR_MSG);
        },
        complete: () => {
          // đăng ký xong đăng nhập luôn
          this.loginModel = {
            username: this.registerForm.get('username')?.value,
            password: this.registerForm.get('password')?.value
          }
          this.authService.login(this.loginModel).subscribe({
            next: () => {
              this.snotiflix.success(MessageConstants.LOGGED_IN);
              this.router.navigate(['/members']);
            },
            error: () => {
              this.snotiflix.error(MessageConstants.LOGIN_FAILED);
            }
          })
        }
      });
    }

  }
  cancel() {
    this.cancelRegister.emit(false)
  }

}
