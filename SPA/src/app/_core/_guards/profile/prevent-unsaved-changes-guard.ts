import { MemberEditComponent } from './../../../views/members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';



@Injectable()
export class PreventUnsavedChanges  {
  canDeactivate(component: MemberEditComponent): boolean {
    if (component.editFrofile.dirty) {
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
    }
    return true;
  }

}