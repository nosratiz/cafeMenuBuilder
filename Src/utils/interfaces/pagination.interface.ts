interface IPagination{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: Array<any>;
}

export default IPagination;