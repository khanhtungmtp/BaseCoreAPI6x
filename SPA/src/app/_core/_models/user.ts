import { Photo } from "./photo";

export interface User {
    id: number;
    username: string | null;
    gender: string | null;
    age: number | null;
    known_as: string | null;
    created: string | null;
    last_active: string | null;
    introduction: string | null;
    looking_for: string | null;
    interests: string | null;
    city: string | null;
    country: string | null;
    photo_url: string | null;
    photos: Photo[];
}