import request from "@/utils/request";
import type {UnwrapNestedRefs} from "vue";
import {getToken} from "@/request/auth";

/* 查询产品信息 */
export const getProductInfo = ():Promise<any> => request.get('/enterprise/getProductInfo');

/* 添加产品信息 */
export const addProductInfo = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise/addProductInfo',params);

/* 修改产品信息 */
export const updateProductInfo = (params: UnwrapNestedRefs<any>):Promise<any> => request.patch('/enterprise/updateProductInfo',params);

/* 删除产品信息 */
export const deleteProductInfo = (key: string):Promise<any> => request.delete('/enterprise/deleteProductInfo/'+key);

/* 查询物资信息 */
export const getInventoryInfo = ():Promise<any> => request.get('/enterprise/getWuzi');

/* 添加物资信息 */
export const addInventoryInfo = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise/addWuzi',params);

/* 修改物资信息 */
export const updateInventoryInfo = (params: UnwrapNestedRefs<any>):Promise<any> => request.patch('/enterprise/updateWuzi',params);

/* 删除物资信息 */
export const deleteInventoryInfo = (key: string):Promise<any> => request.delete('/enterprise/deleteWuzi/'+key);


/* 获取产品收购表 */
export const getProductAcquire = ():Promise<any> => request.get('/purchasing/inStock');

/* 获取产品销售情况 */
export const getProductSale = ():Promise<any> => request.get('/wholesale/getoutstock');

/* 获取机构信息 */
export const getInstitution = ():Promise<any> => request.get('/enterprise/getJigou');

/* 增加机构 */
export const addInstitution = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise/addJigou', params);

/* 修改机构 */
export const updateInstitution = (params: UnwrapNestedRefs<any>):Promise<any> => request.patch('/enterprise/updateJigou',params);

/* 删除机构 */
export const deleteInstitution = (key: string):Promise<any> => request.delete('/enterprise/deleteJigou/'+key);

/* 获取生产计划 */
export const getProductionPlan = ():Promise<any> => request.get('/enterprise/getPlan');

/* 增加生产计划 */
export const addProductionPlan = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise/addPlan', params);

/* 修改生产计划 */
export const updateProductionPlan = (params: UnwrapNestedRefs<any>):Promise<any> => request.patch('/enterprise/updatePlan',params);

/* 删除生产计划 */
export const deleteProductionPlan = (key: string):Promise<any> => request.delete('/enterprise/deletePlan/'+key);

/* 获取公司物资库存 */
export const getInventory = ():Promise<any> => request.get('/enterprise/inventory');

/* 公司物资盘点 */
export const updateInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise/updateInventory',params)

/* 获取物资入库记录 */
export const getInInventory = ():Promise<any> => request.get('/enterprise/inInventory');

/* 物资入库 */
export const addInInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise//inInventory',params)

/* 获取物资出库记录 */
export const getOutInventory = ():Promise<any> => request.get('/enterprise/outInventory');

/* 物资出库 */
export const addOutInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/enterprise/outInventory',params)