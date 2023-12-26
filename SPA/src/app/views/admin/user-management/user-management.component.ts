import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListRoles } from 'src/app/_core/_models/admin/roles';
import { AdminService } from 'src/app/_core/_services/admin.service';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { CaptionConstants, MessageConstants } from 'src/app/_core/_constants/message.enum';
import { NgSnotifyService } from 'src/app/_core/_services/ng-snotify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  /**
   *
   */
  users: ListRoles[] = [];
  availableRoles = [
    'Admin',
    'SuperAdmin',
    'Member'

  ]
  bsModelRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>()
  constructor(private service: AdminService,
    private modalService: BsModalService,
    private snotify: NgSnotifyService,
    private spinner: NgxSpinnerService) {
  }
  ngOnInit(): void {
    this.getUsersWithRoles();
  }
  getUsersWithRoles() {
    this.spinner.show();
    this.service.getUserWithRole().subscribe({
      next: (res) => {
        this.users = res
      }, error: (e) => {
        throw e;
      }
    }).add(() => this.spinner.hide())
  }
  openRolesModal(user: ListRoles) {
    const config: ModalOptions = {
      initialState: {
        username: user.userName,
        rolesUserNameCurrent: user.roleName,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roleName]
      }
    }
    this.bsModelRef = this.modalService.show(RolesModalComponent, config);
    this.bsModelRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModelRef.content?.selectedRoles
        if (!this.arrayEqual(selectedRoles!, user.roleName)) {
          this.service.updateUserWithRoles(user.userName, selectedRoles!).subscribe({
            next: (roles) => {
              user.roleName = roles;
              this.snotify.success(CaptionConstants.SUCCESS,MessageConstants.UPDATED_OK_MSG);
            }, error: (e) => {
              throw e;
            }
          })
        }
      },
      error: () => {
      }
    })
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

}
