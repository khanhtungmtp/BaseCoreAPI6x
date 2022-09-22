import { User } from "./user";

export interface Photo {
    id: number;
    url: string | null;
    description: string | null;
    date_added: string | null;
    is_main: boolean;
    user: User;
    userid: number;
}