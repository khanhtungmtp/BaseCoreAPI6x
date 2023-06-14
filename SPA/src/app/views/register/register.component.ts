import { Router } from '@angular/router';
import { LoginModel } from 'src/app/_core/_models/auth/login-model';
import { UserForRegister } from 'src/app/_core/_models/user';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MessageConstants } from 'src/app/_core/_constants/message.enum';
import { AuthService } from 'src/app/_core/_services/auth.service';
import { NgxNotiflixService } from 'src/app/_core/_services/ngx-notiflix.service';
import Validation from 'src/app/_core/_helpers/utilities/validation';
import { FunctionUtility } from 'src/app/_core/_helpers/utilities/function-utility';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup<{
    country: FormControl<string | null>;
    password: FormControl<string | null>;
    gender: FormControl<string | null>;
    city: FormControl<string | null>;
    date_of_birth: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    known_as: FormControl<string | null>;
    username: FormControl<string | null>
  }> = new FormGroup({
    gender: new FormControl(''),
    username: new FormControl(''),
    known_as: new FormControl(''),
    date_of_birth: new FormControl(),
    city: new FormControl(''),
    country: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  user: UserForRegister = <UserForRegister>{};
  loginModel: LoginModel;
  submitted: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>
  @Output() cancelRegister = new EventEmitter();

  constructor(
    private authService: AuthService,
    private snotiflix: NgxNotiflixService,
    private formBuilder: FormBuilder,
    private router: Router,
    private func: FunctionUtility
  ) {
  }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'YYYY-MM-DD'
    }
    this.registerForms();
  }

  registerForms() {
    this.registerForm = this.formBuilder.group(
      {
        gender: ['male'],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        known_as: ['', Validators.required],
        date_of_birth: ['', [Validators.required]],
        city: [''],
        country: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value as UserForRegister);
      this.authService.register(this.user).subscribe({
        next: () => {
          this.snotiflix.success(MessageConstants.CREATED_OK_MSG);
        }, error: () => {
          this.snotiflix.error(MessageConstants.CREATED_ERROR_MSG);
        },
        complete: () => {
          // đăng ký xong đăng nhập luôn
          this.loginModel = {
            username: this.registerForm.get('username')?.value as string,
            password: this.registerForm.get('password')?.value as string
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
