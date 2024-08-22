export class Result{
    public code: number;
    public message: string;
    public data: any;
    constructor(code: number, message: string, data: any){
        this.code = code;
        this.message = message;
        this.data = data;
    }
    public static success(data: any): Result{
        return new Result(200, "Operation Successful", data);
    }
    public static fail(code: number, message: string): Result{
        return new Result(code, message, null);
    }
}