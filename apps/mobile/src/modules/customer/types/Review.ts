export interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;

    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
}