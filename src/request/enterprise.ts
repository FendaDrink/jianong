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