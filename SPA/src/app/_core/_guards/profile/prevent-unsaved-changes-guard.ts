import { MemberEditComponent } from './../../../views/members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';


@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
    canDeactivate(component: MemberEditComponent): boolean {
        if (component.editForm.dirty ) {
          return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
        }
        return true;
      }

}