import request from "@/utils/request";
import type {UnwrapNestedRefs} from "vue";
import {getToken} from "@/request/auth";

/* 登录 */
export const login = (params:LoginAPIReq):Promise<LoginAPIRes> => request.post('/login',params);

/* 获取详细公共信息标题 */
export const getPublicTitle = ():Promise<PublicTitleAPIRes> => request.get('/publicInfo');

/* 获取详细公共信息列表 */
export const getPublicDetail = ():Promise<PublicDetailAPIRes> => request.get('/publicInfo/getDetail');

/* 通过key获取详细公共信息列表 */
export const getPublicDetailByKey = (key:string):Promise<PublicDetailByKeyAPIRes> => request.get('/publicInfo/getDetail/'+key);

/* 增加详细公共信息记录 */
export const addPublicDetail = (params: UnwrapNestedRefs<AddPublicDetailAPIReq>):Promise<AddPublicDetailAPIRes> => request.post('/publicInfo/getDetail',params);

/* 修改详细公共信息记录 */
export const updatePublicDetail = (params: UnwrapNestedRefs<UpdatePublicDetailAPIReq>):Promise<UpdatePublicDetailAPIRes> => request.patch('/publicInfo/getDetail',params);

/* 删除详细公共信息记录 */
export const deletePublicDetail = (key:string):Promise<DeletePublicDetailAPIRes> => request.delete('/publicInfo/getDetail/'+key);

/* 批量删除详细公共信息记录 */
export const deletePublicDetailBatch = (params:UnwrapNestedRefs<DeletePublicDetailAPIReq>):Promise<DeletePublicDetailAPIRes> => request.post('/publicInfo/getDetail/deleteBatch',params);

/* 通过key获取生产线特殊信息 */
export const getPublicDetailByKeySpecial = (key:string):Promise<PublicDetailByKeySpecialAPIRes> => request.get('/publicInfo/getDetail/special/'+key);

/* 修改生产线特殊信息 */
export const updatePublicDetailByKeySpecial = (params:UpdatePublicSpecialAPIReq):Promise<UpdatePublicSpecialAPIRes> => request.patch('/publicInfo/getDetail/special',params);

/* 获取特殊发动机标题和数据 */
export const getSpecialEngine = ():Promise<SpecialEngineTitleAndDataAPIRes> => request.get('/engine');

/* 新增特殊发动机记录 */
export const addSpecialEngine = (params:UnwrapNestedRefs<AddEngineAPIReq>):Promise<AddEngineAPIRes> => request.post('/engine',params);

/* 修改特殊发动机记录 */
export const updateSpecialEngine = (params:UnwrapNestedRefs<UpdateEngineAPIReq>):Promise<UpdateEngineAPIRes> => request.patch('/engine',params);

/* 删除特殊发动机记录 */
export const deleteSpecialEngine = (key:string):Promise<DeleteEngineAPIRes> => request.delete('/engine/'+key);

/* 批量删除发动机记录 */
export const deleteSpecialEngineBatch = (params:UnwrapNestedRefs<DeleteEngineBatchAPIReq>):Promise<DeleteEngineBatchAPIRes> => request.post('/engine/deleteBatch',params);

/* 获取计划用颜色标题和数据 */
export const getColor = ():Promise<ColorTitleAndDataAPIRes> => request.get('/color');

/* 新增计划用颜色配置记录 */
export const addColor = (params:UnwrapNestedRefs<AddColorAPIReq>):Promise<AddColorAPIRes> => request.post('/color',params);

/* 修改计划用颜色配置记录 */
export const updateColor = (params:UnwrapNestedRefs<UpdateColorAPIReq>):Promise<UpdateColorAPIRes> => request.patch('/color',params);

/* 删除计划用颜色配置记录 */
export const deleteColor = (key:string):Promise<DeleteColorAPIRes> => request.delete('/color/'+key);

/* 批量删除计划用颜色配置记录 */
export const deleteColorBatch = (params:UnwrapNestedRefs< DeleteColorBatchAPIReq>):Promise< DeleteColorBatchAPIRes> => request.post('/color/deleteBatch',params);

/* 获取操作日志 */
export const getLog = ():Promise<LogsAPIRes> => request.get('/log');

/* 获取订单车标题和数据 */
export const getOrderCar = ():Promise<OrderTitleAndDataAPIRes> => request.get('/car');

/* 通过orderId获取订单车记录 */
export const getOrderCarByOrderId = (orderId:string):Promise<OrderDetailAPIRes> => request.get('/car/'+orderId);
/* 新增订单车记录 */
export const addOrderCar = (params:UnwrapNestedRefs<AddOrderAPIReq>):Promise<AddOrderAPIRes> => request.post('/car',params);

/* 修改订单车记录 */
export const updateOrderCar = (params:UnwrapNestedRefs<UpdateOrderAPIReq>):Promise<UpdateOrderAPIRes> => request.patch('/car',params);

/* 删除订单车记录 */
export const deleteOrderCar = (orderId:string):Promise<DeleteOrderAPIRes> => request.delete('/car/'+orderId);

/* 上传文件 */
export const uploadFile = async (params:UnwrapNestedRefs<UploadFileAPIReq>):Promise<UploadFileAPIRes> => request.post(
    '/car/upload',params,{
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': getToken()
        },
})

/* 批量删除订单车记录 */
export const deleteOrderCarBatch = (params:UnwrapNestedRefs<any>):Promise<DeleteOrdersAPIRes> => request.post('/car/deleteBatch',params);
// 代购点
// 农户增删改查
export const addFarmerInfo = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/farmer',params);
export const deleteFarmerInfo = (key:string[]):Promise<any> => request.delete('/purchasing/farmer'+key);
export const updateFarmerInfo = (params:UnwrapNestedRefs<any>):Promise<UpdateOrderAPIRes> => request.patch('/purchasing/farmer',params);
export const getFarmerInfo = ():Promise<any> => request.get('/purchasing/farmer');
// 产品管理
// 查询代购点产品库存
export const getProductstock = ():Promise<any> => request.get('/purchasing/stock');
// 查询代购点商品新增几个
export const getProducInstock = ():Promise<any> => request.get('/purchasing/inStock');
// 产品收购
export const purchasingInstock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/inStock',params);
// 查询代购点出入库记录
export const checkOutStock = ():Promise<any> => request.get('/purchasing/outStock');
// 产品出库
export const purchasingOutstock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/outStock',params)
// 获取代购点物资库存
export const getPurInventory = ():Promise<any> => request.get('/purchasing/inventory');
// 代购点产品盘点
export const purchasingUpdateStock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/updateStock',params)
// 代购点物资盘点
export const purchasingUpdateInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/updateInventory',params)
// 代购点物资入库记录
export const getInInventory = ():Promise<any> => request.get('/purchasing/inInventory');

// 代购点物资入库
export const purchasingInInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/inInventory',params)

// 代购点物资出库记录
export const getOutInventory = ():Promise<any> => request.get('/purchasing/outInventory');

// 代购点物资出库
export const purchasingOutInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/purchasing/outInventory',params)

// 批发中心
// 获取顾客信息
export const getcustomerInfo = ():Promise<any> => request.get('/wholesale/getcustomer');
// 增加客户信息（弹窗）
export const addcustomerInfo = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/wholesale/addcustomer',params)
// 修改客户信息
export const updatecustomerInfo = (params:UnwrapNestedRefs<any>):Promise<UpdateOrderAPIRes> => request.patch('wholesale/updatecustomer',params);
// 删除客户信息
export const deletecustomerInfo = (key:string):Promise<any> => request.delete('/wholesale/deletecustomer/'+key);
// 查询产品库存
export const getProductStock = ():Promise<any> => request.get('/wholesale/getstock');
// 查询入库记录
export const getProductInstock = ():Promise<any> => request.get('/wholesale/getinstock');
// 查询产品出库记录
export const getProductOuttock = ():Promise<any> => request.get('/wholesale/getoutstock');
// 查询产品信息
export const getproductInfo = ():Promise<any> => request.get('/wholesale/getproduct');
// 批发中心产品盘存
export const wholesaleUpdatestock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/wholesale/updateStock',params)
// 产品出库（销售）
export const wholesaleOutstock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/wholesale/outStock',params)
// 产品入库
export const wholesaleInstock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/wholesale/inStock',params)
