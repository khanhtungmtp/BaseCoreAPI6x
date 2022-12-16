import { PaginationParams, PaginationResult } from './../_helpers/utilities/pagination-utilities';
import { Message } from 'src/app/_core/_models/message';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { catchError, empty, Observable } from 'rxjs';
import { NgxNotiflixService } from '../_services/ngx-notiflix.service';
import { MessageService } from '../_services/message.service';
import { MessageConstants } from '../_constants/message.enum';
import { LocalStorageContains } from '../_constants/localStorageContains';
@Injectable()
export class MessagesResolver implements Resolve<PaginationResult<Message[]>> {
    paginationParams: PaginationParams = {
        pageNumber: 1,
        pageSize: 5
    }
    messageContainer = 'Unread';
    constructor(
        private messageService: MessageService,
        private router: Router,
        private notiflix: NgxNotiflixService
    ) { }
    resolve(): Observable<PaginationResult<Message[]>> {
        let user = JSON.parse(localStorage.getItem(LocalStorageContains.USER) as string);
        console.log(user);
        throw new Error('Method not implemented.');
        return this.messageService.getMessageForUser(+user.id, this.paginationParams, this.messageContainer).pipe(
            catchError((error) => {
                this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
                this.router.navigate(['/']);
                return empty();
            })
        )
    }




}
