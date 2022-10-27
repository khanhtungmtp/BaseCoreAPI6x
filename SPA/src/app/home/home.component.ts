import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { LocalStorageContains } from '../_core/_constants/localStorageContains';
import { User } from '../_core/_models/user';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(mode: boolean) {
    this.registerMode = mode
  }

}
