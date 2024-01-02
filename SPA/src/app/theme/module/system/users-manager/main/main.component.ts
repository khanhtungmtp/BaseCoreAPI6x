import { Component, OnInit } from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { FormComponent } from '../form/form.component';
import { PeriodicElement, TablesDataService } from 'app/routes/tables/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [TablesDataService],
})
export class MainComponent implements OnInit {
  searchStr = '';
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('usersManager.position'),
      field: 'position',
      sortable: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: this.translate.stream('usersManager.title'),
      field: 'title',
      sortable: true,
      minWidth: 100,
    },
    {
      header: this.translate.stream('usersManager.userName'),
      field: 'userName',
      sortable: true,
      disabled: true,
      minWidth: 100,
    },
    {
      header: this.translate.stream('usersManager.fullName'),
      field: 'fullName',
      minWidth: 100,
    },
    {
      header: this.translate.stream('usersManager.email'),
      field: 'email',
      minWidth: 100,
    },
    {
      header: this.translate.stream('usersManager.roles'),
      field: 'roles',
      minWidth: 100,
    },
    {
      header: this.translate.stream('usersManager.phoneNumer'),
      field: 'phoneNumer',
      hide: true,
      minWidth: 120,
    },
    {
      header: this.translate.stream('usersManager.operation'),
      field: 'operation',
      minWidth: 140,
      width: '140px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: this.translate.stream('usersManager.edit'),
          click: record => this.edit(record),
        },
        {
          type: 'icon',
          color: 'warn',
          icon: 'delete',
          tooltip: this.translate.stream('usersManager.delete'),
          pop: {
            title: this.translate.stream('usersManager.confirm_delete'),
            closeText: this.translate.stream('usersManager.close'),
            okText: this.translate.stream('usersManager.ok'),
          },
          click: record => this.delete(record),
        },
      ],
    },
  ];
  list: PeriodicElement[] = [];
  dataMain: PeriodicElement[] = [];
  isLoading = true;

  multiSelectable = true;
  rowSelectable = true;
  hideRowSelectionCheckbox = false;
  showToolbar = true;
  columnHideable = true;
  columnSortable = true;
  columnPinnable = true;
  rowHover = false;
  rowStriped = false;
  showPaginator = true;
  expandable = false;
  columnResizable = false;

  constructor(
    private translate: TranslateService,
    private dataSrv: TablesDataService,
    private dialog: MtxDialog
  ) { }

  ngOnInit() {
    this.getData();
    this.isLoading = false;
  }

  getData() {
    this.list = this.dataSrv.getData();
    this.dataMain = this.list;
  }

  search() {
    console.log('this.searchStr : ', this.searchStr);
    if (this.searchStr === '') {
      // Nếu searchTerm rỗng, trả về toàn bộ danh sách
      return (this.list = this.dataMain);
    }
    this.list = this.dataMain.filter(item => {
      return Object.values(item).some(value =>
        value.toString().toLowerCase().includes(this.searchStr.toLowerCase())
      );
    });
    return this.list;
  }

  clearInputSearch() {
    this.searchStr = ''
    this.search();
  }
  onInputChange() {
    this.search();
  }

  edit(value: any) {
    const dialogRef = this.dialog.originalOpen(FormComponent, {
      width: '600px',
      data: { record: value },
    });

    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }

  delete(value: any) {
    this.dialog.alert(`You have deleted ${value.position}!`);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }
}
