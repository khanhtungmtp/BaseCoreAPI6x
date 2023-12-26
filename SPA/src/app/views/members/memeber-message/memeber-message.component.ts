import { CaptionConstants, MessageConstants } from 'src/app/_core/_constants/message.enum';
import { Message } from 'src/app/_core/_models/message';
import { MessageService } from 'src/app/_core/_services/message.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_core/_models/user';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';

import { tap } from 'rxjs';
import { OperationResult } from 'src/app/_core/_helpers/utilities/operationResult';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';


@Component({
  selector: 'app-memeber-message',
  templateUrl: './memeber-message.component.html',
  styleUrls: ['./memeber-message.component.css']
})
export class MemeberMessageComponent implements OnInit {
  @Input() recipientId: number;
  user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
  messages: Message[] = [];
  newMessages: Message = {
    id: 0,
    senderId: 0,
    senderKnownAs: '',
    senderPhotoUrl: '',
    recipientId: 0,
    recipientKnownAs: '',
    recipientPhotoUrl: '',
    content: '',
    isRead: false,
    dateRead: undefined,
    messageSent: new Date(),
  };
  defaultImage: string = '../../../../assets/user_default.png';
  constructor(
    private messageService: MessageService,
    private snotify: NgSnotifyService,
    private spinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getMessagesThread();
  }

  getMessagesThread() {
    this.messageService.getMesageThread(this.user.id, this.recipientId)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].isRead === false && messages[i].recipientId == this.user.id) {
              this.messageService.markAsRead(this.user.id, messages[i].id);
            }
          }
        })
      )
      .subscribe({
        next: (res) => {
          this.messages = res
        }, error: (e) => {
          throw e;
        }
      })
  }

  sendMessage() {
    this.newMessages.recipientId = this.recipientId;
    this.messageService.createMessage(this.user.id, this.newMessages).subscribe({
      next: (res: OperationResult) => {
        this.messages.unshift(res.data);
        this.newMessages.content = '';
        this.spinner.hide();
      },
      error: () => this.snotify.error(CaptionConstants.ERROR, MessageConstants.UN_KNOWN_ERROR),
      complete: () => this.spinner.hide()
    })
  }


}
