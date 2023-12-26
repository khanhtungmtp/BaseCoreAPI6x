import { Router } from '@angular/router';
import { LoginModel } from 'src/app/_core/_models/auth/login-model';
import { UserForRegister } from 'src/app/_core/_models/user';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CaptionConstants, MessageConstants } from 'src/app/_core/_constants/message.enum';
import { AuthService } from 'src/app/_core/_services/auth.service';
import Validation from 'src/app/_core/_helpers/utilities/validation';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';

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
    dateOfBirth: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    knownAs: FormControl<string | null>;
    userName: FormControl<string | null>
  }> = new FormGroup({
    gender: new FormControl(''),
    userName: new FormControl(''),
    knownAs: new FormControl(''),
    dateOfBirth: new FormControl(),
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
    private snotify: NgSnotifyService,
    private formBuilder: FormBuilder,
    private router: Router
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
        userName: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        knownAs: ['', Validators.required],
        dateOfBirth: ['', [Validators.required]],
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
          this.snotify.success(CaptionConstants.SUCCESS,MessageConstants.CREATED_OK_MSG);
        }, error: (e) => {
          throw e;
        },
        complete: () => {
          // đăng ký xong đăng nhập luôn
          this.loginModel = {
            userName: this.registerForm.get('userName')?.value as string,
            password: this.registerForm.get('password')?.value as string
          }
          this.authService.login(this.loginModel).subscribe({
            next: () => {
              this.snotify.success(CaptionConstants.SUCCESS, MessageConstants.LOGGED_IN);
              this.router.navigate(['/members']);
            },
            error: (e) => {
              throw e;
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
