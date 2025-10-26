export interface ApiError {
    message: string;
    details?: string;
    statusCode: number;
}