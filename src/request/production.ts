import request from "@/utils/request";
import type {UnwrapNestedRefs} from "vue";
import {getToken} from "@/request/auth";

/* 获取生产基地产品库存 */
export const getStock = ():Promise<any> => request.get('/production/getstock');

/* 生产基地产品盘点 */
export const productionUpdateStock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/production/updateStock',params)

/* 生产基地产品入库记录 */
export const getProducInstock = ():Promise<any> => request.get('/production/getinstock')

/* 生产基地产品入库 */
export const productionInstock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/production/instock',params)

/* 生产基地产品出库记录 */
export const getProducOutstock = ():Promise<any> => request.get('/production/getoutstock')

/* 生产基地产品出库 */
export const productionOutstock = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/production/outstock',params)

/* 生产基地物资入库记录 */
export const getInInventory = ():Promise<any> => request.get('/production/inInventory');

/* 生产基地物资入库 */
export const addInInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/production/inInventory',params)

/* 生产基地物资出库记录 */
export const getOutInventory = ():Promise<any> => request.get('/production/outInventory');

/* 生产基地物资出库 */
export const addOutInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/production/outInventory',params)

/* 生产基地物资库存 */
export const getPurInventory = ():Promise<any> => request.get('/production/inventory');

/* 生产基地物资盘点 */
export const productionUpdateInventory = (params: UnwrapNestedRefs<any>):Promise<any> => request.post('/production/updateInventory',params)
