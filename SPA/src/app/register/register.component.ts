
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_core/_services/auth.service';
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
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe({
      next: (res) => {
        console.log(res);
      }, error: () => {
        console.log('err');
      }
    });
  }
  cancel() {
    this.cancelRegister.emit(false)
  }

}
