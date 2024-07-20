export type CustomError = {
    code: number;
    data: any;
    error: {
        debugMessage: string;
        message: string;
        status: string;
        subErrors: Array<CustomError>;
    };
    timestamp: string;
};
