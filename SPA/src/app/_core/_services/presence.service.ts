import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { UserLogin } from 'src/app/_core/_models/user';
import { NgSnotifyService } from './ng-snotify.service';
import { CaptionConstants } from 'src/app/_core/_constants/message.enum';
@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl: string = environment.hubUrl;
  private hubConnection?: HubConnection;

  constructor(private snotify: NgSnotifyService) { }
  createHubConnection(user: UserLogin) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presense', {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build()

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on("UserIsOnline", userName => {
      this.snotify.info(CaptionConstants.SUCCESS, userName + 'has connected')
    })
    this.hubConnection.on("UserIsOffline", userName => {
      this.snotify.warning(CaptionConstants.WARNING, userName + 'has disconnected')
    })
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
