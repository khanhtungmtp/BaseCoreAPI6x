import { MessageConstants } from './../../../_core/_constants/message.enum';
import { Message } from './../../../_core/_models/message';
import { MessageService } from './../../../_core/_services/message.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_core/_models/user';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { NgxNotiflixService } from 'src/app/_core/_services/ngx-notiflix.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-memeber-message',
  templateUrl: './memeber-message.component.html',
  styleUrls: ['./memeber-message.component.css']
})
export class MemeberMessageComponent implements OnInit {
  @Input() recipientid: number;
  user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
  messages: Message[] = [];
  newMessages: Message = {
    id: 0,
    senderid: 0,
    sender_known_as: '',
    sender_photo_url: '',
    recipientid: 0,
    recipient_known_as: '',
    recipient_photo_url: '',
    content: '',
    is_read: false,
    date_read: undefined,
    message_sent: new Date(),
  };

  constructor(
    private messageService: MessageService,
    private notiflix: NgxNotiflixService
  ) { }

  ngOnInit(): void {
    this.getMessagesThread();
  }

  getMessagesThread() {
    this.messageService.getMesageThread(this.user.id, this.recipientid)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].is_read === false && messages[i].recipientid == this.user.id) {
              this.messageService.markAsRead(messages[i].id, this.user.id);
            }
          }
        })
      )
      .subscribe({
        next: (res) => {
          this.messages = res
        },
        error: () => {
          this.notiflix.error(MessageConstants.UN_KNOWN_ERROR);
        }
      })
  }

  sendMessage() {
    this.newMessages.recipientid = this.recipientid;
    this.messageService.createMessage(this.user.id, this.newMessages).subscribe({
      next: (res: any) => {
        this.messages.unshift(res);
        this.newMessages.content = '';
        this.notiflix.hideLoading()
      },
      error: () => this.notiflix.error(MessageConstants.UN_KNOWN_ERROR),
      complete: () => this.notiflix.hideLoading()
    })
  }


}
