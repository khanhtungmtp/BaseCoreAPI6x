import { PaginationParams, PaginationResult } from './../_helpers/utilities/pagination-utilities';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { OperationResult } from '../_helpers/utilities/operationResult';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl: string = environment.apiUrl + 'users/';

  constructor(
    private http: HttpClient
  ) { }

  getMessageForUser(userid: number, param?: PaginationParams, messageContainer?: string) {
    let params = new HttpParams()
    if (param?.pageNumber != null && param.pageSize != null) {
      params = params.appendAll({ ...param });
    }
    if (messageContainer) {
      params = params.append('message_container', messageContainer)
    }
    return this.http.get<PaginationResult<Message>>(this.baseUrl + userid + '/Message/GetMessageForUser', { params });
  }

  getMesageThread(userid: number, recipientid: number) {
    return this.http.get<Message[]>(this.baseUrl + userid + '/Message/Thread/' + recipientid);
  }

  createMessage(userid: number, message: Message) {
    return this.http.post<OperationResult>(this.baseUrl + userid + '/Message/CreateMessage/', message);
  }

  deleteMessage(userid: number, message_id: number) {
    return this.http.delete(this.baseUrl + userid + '/Message/DeleteMessage/' + message_id, {});
  }

  markAsRead(userid: number, message_id: number) {
    this.http.post(this.baseUrl + userid + '/Message/MarkAsRead/' + message_id, {}).subscribe();
  }
}
