interface IBaseInfo {
    title: string;
    status:string;
    start:Date;
    end:Date;
    limit:number;
    seats:number;
    description?:string;
}

export default IBaseInfo;