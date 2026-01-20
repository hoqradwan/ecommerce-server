import {  Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CustomRequest } from "../../utils/customRequest";
import httpStatus from "http-status";
import { createOrderInToDB, getAllOrdersFromDB } from "./order.service";

export const createOrder = catchAsync(async (req: CustomRequest, res: Response ) => {
  const  {products}  = req.body;
  const userData = req.user;
  const result = await createOrderInToDB(products,userData as any);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});
export const getAllOrders = catchAsync(async (req: CustomRequest, res: Response ) => {
 const userData = req.user;
  const result = await getAllOrdersFromDB(userData as any);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Orders retrieved successfully",
    data: result,
  });
});