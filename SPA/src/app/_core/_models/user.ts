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