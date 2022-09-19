import { HttpClient } from '@angular/common/http';
import { Component,  OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  values: any;
  
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getValues();
  }

  getValues(){
    this.http.get('https://localhost:7215/api/Values').subscribe(res => {
      this.values = res;
    }, error => {
      console.log(error); 
    })
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(mode: boolean){
    this.registerMode = mode
  }

}
