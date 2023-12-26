export interface Photo {
    id: number;
    url: string;
    description: string | null;
    dateAdded: string | null;
    isMain: boolean;
}
