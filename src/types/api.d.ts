// 登录请求类型约束
interface LoginAPIReq{
    username: string,
    password: string
}

// 登录的响应类型约束
interface LoginAPIRes{
    data:{
        msg:string;
        code:number;
        data?:{
            token?:string;
            username:string;
        }
    }
}

// 公共信息标题的相应类型约束
interface PublicTitleAPIRes{
    data:{
        msg:string;
        code:number;
        data:[];
    }
}

// 公共生产线信息的响应类型约束
interface PublicDetailAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            key:string;
            code:string;
            type:string;
            name:string;
            classes:number;
            speed:number;
            efficiency:number;
            group:number;
            flow:number;
            simple:string;
        }[];
    }
}

// 通过key获取公共信息的响应类型约束
interface PublicDetailByKeyAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            title:string;
            value:string;
        }[];
    }
}

// 通过key获取生产线特殊信息的响应类型约束
interface PublicDetailByKeySpecialAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            key:string;
            code:string;
            label:string;
            value:string;
        }[];
    }
}
// 修改生产线特殊信息的请求类型约束
interface UpdatePublicSpecialAPIReq{
    key: string;
    value:string;
}

// 修改生产线特殊信息的响应类型约束
interface UpdatePublicSpecialAPIRes{
    data:{
        msg:string;
        code:number;
        data:any
    }
}

// 增加公共信息请求的类型约束
interface AddPublicDetailAPIReq{
    code: string;
    type: string;
    name: string;
    classes: number | null;
    speed: number | null;
    efficiency: number | null;
    group: number | null;
    flow: number | null;
    simple: string;
}

// 增加公共信息的响应类型约束
interface AddPublicDetailAPIRes{
    data:{
        msg:string;
        code:number;
        data:object;
    }
}

// 修改公共信息的请求类型约束
interface UpdatePublicDetailAPIReq{
    key: string;
    code: string;
    type: string;
    name: string;
    classes: number;
    speed: number;
    efficiency: number;
    group: number;
    flow: number;
    simple: string;
}

// 修改公共信息的响应类型约束
interface UpdatePublicDetailAPIRes{
    data:{
        msg:string;
        code:number;
        data:any;
    }
}

// 删除公共信息的响应类型约束
interface DeletePublicDetailAPIRes{
    data:{
        msg:string;
        code:number;
        data:[]
    }
}

// 批量删除公共信息的请求类型约束
interface DeletePublicDetailAPIReq{
    keys:string[];
}

// 批量删除公共信息的响应类型约束
interface DeletePublicDetailAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}

// 获取特殊发动机标题和数据的响应类型约束
interface SpecialEngineTitleAndDataAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            title:{
               title:string;
               dataIndex:string;
               width:string
            }[];
            value:{}[];
        };
    }
}

// 增加特殊发动机的请求类型约束
interface AddEngineAPIReq{
    code: string;
    stall:number | null;
    name:string;
}

// 增加特殊发动机的响应类型约束
interface AddEngineAPIRes{
    data:{
        msg:string;
        code:number;
        data:string;
    }
}

// 修改特殊发动机的请求类型约束
interface UpdateEngineAPIReq{
    key: string;
    code: string;
    stall:number;
    name:string;
}

// 修改特殊发动机的响应类型约束
interface UpdateEngineAPIRes{
    data:{
        msg:string;
        code:number;
        data:string;
    }
}

// 删除特殊发动机的响应类型约束
interface DeleteEngineAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}

// 批量删除特殊发动机的请求类型约束
interface DeleteEngineBatchAPIReq{
    keys:string[];
}

// 批量删除特殊发动机的响应类型约束
interface DeleteEngineBatchAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}

// 获取计划用颜色配置标题和详情的响应类型约束
interface ColorTitleAndDataAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            title:{
                title:string;
                dataIndex:string;
                width:string
            }[];
            value:{}[];
        };
    }
}

// 新增计划用颜色配置的请求类型约束
interface AddColorAPIReq{
    code:string;
    name:string;
    color:string;
}

// 新增计划用颜色配置的响应类型约束
interface AddColorAPIRes{
    data:{
        msg:string;
        code:number;
        data:string;
    }
}

// 修改计划用颜色配置的请求类型约束
interface UpdateColorAPIReq{
    key:string;
    code:string;
    name:string;
    color:string;
}

// 修改计划用颜色配置的响应类型约束
interface UpdateColorAPIRes{
    data:{
        msg:string;
        code:number;
        data:string;
    }
}

// 删除计划用颜色配置的响应类型约束
interface DeleteColorAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}

// 批量删除计划用颜色配置的请求类型约束
interface DeleteColorBatchAPIReq{
    keys:string[];
}

// 批量删除计划用颜色配置的响应类型约束
interface DeleteColorBatchAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}

// 查询操作日志的响应类型约束
interface LogsAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            user:string;
            method:string;
            url:string;
            requestBody:string;
            timestamp:string;
            status:string;
        }[]
    }
}

// 获取订单车标题和详情的响应类型约束
interface OrderTitleAndDataAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            title:{
                title:string;
                dataIndex:string;
                width:number;
            }[];
            value:{}[];
        };
    }
}

// 通过orderId获取公共信息列表的响应类型约束
interface OrderDetailAPIRes{
    data:{
        msg:string;
        code:number;
        data:{
            title:string;
            value:string;
        }[];
    }
}


// 增加订单车的请求类型约束
interface AddOrderAPIReq{
    orderId:string;
    year:number|null;
    inTime:any;
    type:string;
    airCode:string;
    colorCode:number|null;
    batchNum:string;
    carNum:number|null;
    varietyCode:string;
    carCode:string;
    stall:number|null;
    engineCode:string;
    customer:string;
    orderBatchNum:string;
    requirements:string;
    remark:string;
}

// 增加订单车的响应类型约束
interface AddOrderAPIRes{
    data:{
        msg:string;
        code:number;
        data:string;
    }
}

// 修改订单车的请求类型约束
interface UpdateOrderAPIReq{
    orderId:string;
    year:number|null;
    inTime:any;
    type:string;
    airCode:string;
    colorCode:number|null;
    batchNum:string;
    carNum:number|null;
    varietyCode:string;
    carCode:string;
    stall:number|null;
    engineCode:string;
    customer:string;
    orderBatchNum:string;
    requirements:string;
}

// 修改订单车的响应类型约束
interface UpdateOrderAPIRes{
    data:{
        msg:string;
        code:number;
        data:string;
    }
}

// 删除订单车的响应类型约束
interface DeleteOrderAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}

// 上传文件的请求类型约束
interface UploadFileAPIReq{
    file:FormData;
}

// 上传文件的响应类型约束
interface UploadFileAPIRes{
    data:{
        msg:string;
        code:number;
        data:any;
    }
}

// 批量删除订单车的请求类型约束
interface DeleteOrdersAPIReq{
    orderIds:string[];
}

// 批量删除订单车的响应类型约束
interface DeleteOrdersAPIRes{
    data:{
        msg:string;
        code:number;
        data:string
    }
}