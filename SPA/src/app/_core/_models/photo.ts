export interface Photo {
    id: number;
    url: string;
    description: string | null;
    date_added: string | null;
    is_main: boolean;
}