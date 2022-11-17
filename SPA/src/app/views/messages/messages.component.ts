import { PaginationUtilities } from './../../_core/_helpers/utilities/pagination-utilities';
import { MessageService } from './../../_core/_services/message.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { User } from 'src/app/_core/_models/user';
import { Message } from 'src/app/_core/_models/message';
import { NgxNotiflixService } from 'src/app/_core/_services/ngx-notiflix.service';
import { MessageConstants } from 'src/app/_core/_constants/message.enum';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
  pagination: PaginationUtilities = <PaginationUtilities>{
    pageNumber: 1,
    pageSize: 10
  };
  messages: Message[] = [];
  messageContainer: string = 'unread';
  constructor(
    private messageService: MessageService,
    private notiflix: NgxNotiflixService
  ) { }

  ngOnInit(): void {
    this.getMessageForUser();
  }

  getMessageForUser(messageContainer?: string) {
    this.notiflix.showLoading();
    if (messageContainer) {
      this.messageContainer = messageContainer;
    }
    this.messageService.getMessageForUser(this.user.id, this.pagination, this.messageContainer).subscribe({
      next: (res) => {
        this.messages = res.result;
        this.pagination = res.pagination;
        this.notiflix.hideLoading();
      }, error: () => {
        this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
        this.notiflix.hideLoading();
      }
    });
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event.page;
    this.getMessageForUser();
  }

}
