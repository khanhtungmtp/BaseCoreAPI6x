import { MessageConstants } from '../_constants/message.enum';
import { catchError } from 'rxjs/operators';
import { NgxNotiflixService } from '../_services/ngx-notiflix.service';
import { UserService } from '../_services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { empty, Observable } from 'rxjs';
import { PaginationParams, PaginationResult } from '../_helpers/utilities/pagination-utilities';
@Injectable()
export class MemberListResolver implements Resolve<PaginationResult<User[]>> {
    paginationParams: PaginationParams = <PaginationParams>{
        pageNumber: 1,
        pageSize: 2
    }
    constructor(
        private userService: UserService,
        private router: Router,
        private notiflix: NgxNotiflixService
    ) { }

    resolve(): Observable<PaginationResult<User[]>> {
        return this.userService.getUsers(this.paginationParams).pipe(
            catchError((error) => {
                this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
                this.router.navigate(['/']);
                return empty();
            })
        )
    }
}
