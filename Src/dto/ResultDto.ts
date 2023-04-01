import IResult from "../utils/interfaces/result.interface";

class ResultDto implements IResult {
    status: number;
    message: string;
    data: any;
    
    constructor() {
        this.status = 200;
        this.message = "";
        this.data = null;
    }

}

export default  ResultDto;