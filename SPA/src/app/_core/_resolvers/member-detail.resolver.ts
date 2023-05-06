import { MessageConstants } from './../_constants/message.enum';
import { catchError } from 'rxjs/operators';
import { NgxNotiflixService } from './../_services/ngx-notiflix.service';
import { UserService } from './../_services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/user';
import { empty, Observable } from 'rxjs';
@Injectable()
export class MemberDetailResolver  {
    constructor(
        private userService: UserService,
        private router: Router,
        private notiflix: NgxNotiflixService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(+route.params['id']).pipe(
            catchError((error) => {
                this.notiflix.error(MessageConstants.SYSTEM_ERROR_MSG);
                this.router.navigate(['/']);
                return empty();
            })
        )
    }
}
