import { Pagination } from 'src/app/_core/_helpers/utilities/pagination-utilities';
import { MessageService } from 'src/app/_core/_services/message.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageContains } from 'src/app/_core/_constants/localStorageContains';
import { User } from 'src/app/_core/_models/user';
import { Message } from 'src/app/_core/_models/message';
import { CaptionConstants } from 'src/app/_core/_constants/message.enum';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
  pagination: Pagination = <Pagination>{
    pageNumber: 1,
    pageSize: 10
  };
  messages: Message[] = [];
  messageContainer: string = 'unRead';
  constructor(
    private messageService: MessageService,
    private snotify: NgSnotifyService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getMessageForUser(this.messageContainer);
  }

  getMessageForUser(messageContainer?: string) {
    this.spinner.show();
    if (messageContainer) {
      this.messageContainer = messageContainer;
    }
    this.messageService.getMessageForUser(this.user.id, this.pagination, this.messageContainer)
      .subscribe({
        next: (res) => {
          this.messages = res.result;
          this.pagination = res.pagination;
          this.spinner.hide();
        }, error: (e) => {
          throw e;
        }
      });
  }

  deleteMessage(messageId: number) {
    this.snotify.confirm('Delete this message ?', 'Are you sure you want to delete this message', () => {
      this.messageService.deleteMessage(this.user.id, messageId).subscribe({
        next: () => {
          this.messages.splice(this.messages.findIndex(m => m.id == messageId), 1);
          this.snotify.success(CaptionConstants.SUCCESS, 'Message has been deleted');
          this.spinner.hide();
        },
        error: () => this.snotify.error(CaptionConstants.ERROR, 'Failed to delete the message')
      }).add(() => this.spinner.hide())
    })
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event.page;
    this.getMessageForUser();
  }

}
