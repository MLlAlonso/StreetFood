export interface BusinessHour {
    day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    enabled: boolean;
    open_time: string | null;
    close_time: string | null;
}