import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UserLogin } from 'src/app/_core/_models/user';
import { NgxNotiflixService } from './ngx-notiflix.service';
@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl: string = environment.hubUrl;
  private hubConnection?: HubConnection;

  constructor(private notiflix: NgxNotiflixService) { }
  createHubConnection(user: UserLogin) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presense', {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build()

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on("UserIsOnline", username => {
      this.notiflix.info(username + 'has connected')
    })
    this.hubConnection.on("UserIsOffline", userName => {
      this.notiflix.warning(userName + 'has disconnected')
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
