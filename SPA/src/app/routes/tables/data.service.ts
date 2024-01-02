import { Injectable } from '@angular/core';

export interface PeriodicElement {
  title: string;
  position: number;
  userName: string;
  fullName: string;
  email?: string;
  roles?: string;
  phoneNumer?: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    title: 'Hydrogen',
    phoneNumer: '13198765432',
    userName: 'chipheo',
    fullName: 'New York',
    roles: 'guest',
    email: 'Hydrogen@gmail.com',
  },
  {
    position: 2,
    title: 'suboi',
    phoneNumer: '13198765432',
    userName: 'suboi',
    fullName: 'New York',
    roles: 'user',
    email: 'suboi@gmail.com',
  },
  {
    position: 3,
    title: 'sieunhando',
    phoneNumer: '13198765432',
    userName: 'gao red',
    fullName: 'New York',
    roles: 'guest',
    email: 'sieunhando@gmail.com',
  },
  {
    position: 4,
    title: 'sieunhanxanh',
    phoneNumer: '13198765432',
    userName: '010-12345678',
    fullName: 'gao blue',
    roles: 'user',
    email: 'sieunhanxanh@gmail.com',
  },
  {
    position: 5,
    title: 'sieunhanvang',
    phoneNumer: '0979459639',
    userName: 'gaoyellow',
    fullName: 'New York',
    roles: 'admin',
    email: 'sieunhanvang@gmail.com',
  },
  {
    position: 6,
    title: 'sieunhanbac',
    phoneNumer: '01238860500',
    userName: 'gaobacmtp',
    fullName: 'New York',
    roles: 'superadmin',
    email: 'gaobac@gmail.com',
  },
];

@Injectable()
export class TablesDataService {
  getData() {
    return ELEMENT_DATA;
  }
}
