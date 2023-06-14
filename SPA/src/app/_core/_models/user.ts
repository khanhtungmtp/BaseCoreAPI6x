import { Photo } from "./photo";

export interface User {
  id: number;
  username: string;
  gender: string;
  age: number;
  known_as: string;
  created: string;
  last_active: string;
  introduction: string;
  looking_for: string;
  interests: string;
  city: string;
  country: string;
  photo_url: string;
  photos: Photo[];
}

export interface UserLogin {
  id: number;
  username: string;
  token: string;
  photoUrl: string | null;
  knownAs: string;
  gender: string;
  roles: string[]
}

export interface UserForRegister {
  username: string;
  password: string;
  gender: string;
  known_as: string;
  date_of_birth: string;
  city: string;
  country: string;
  created: string;
  last_active: string;
}

export interface UserFilter {
  gender: string;
  min_age: number;
  max_age: number;
  order_by: string;
}
