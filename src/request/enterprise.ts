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