import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  username = ''; // from ModalOptions user-management
  rolesUserNameCurrent: string[];
  availableRoles: any[] = [];
  selectedRoles: any[] = [];
  closeBtnName = ''

  constructor(public bsModalRef: BsModalRef,) {


  }
  ngOnInit(): void {
    console.log(this.username);
  }
  updateChecked(checkValue: string) {
    const index = this.selectedRoles.indexOf(checkValue);
    index != -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkValue);
  }
}
