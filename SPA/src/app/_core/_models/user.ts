import { Photo } from "./photo";

export interface User {
  id: number;
  userName: string;
  gender: string;
  age: number;
  knownAs: string;
  created: string;
  lastActive: string;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photoUrl: string;
  photos: Photo[];
  roles: string[];
}

export interface UserLogin {
  id: number;
  userName: string;
  token: string;
  photoUrl: string | null;
  knownAs: string;
  gender: string;
  roles: string[]
}

export interface UserForRegister {
  userName: string;
  password: string;
  gender: string;
  knownAs: string;
  dateOfBirth: Date | string;
  city: string;
  country: string;
  created: Date | string;
  lastActive: Date | string;
}

export interface UserFilter {
    gender: string;
    minAge: number;
    maxAge: number;
    orderBy: string;
}
