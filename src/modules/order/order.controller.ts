import {  Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CustomRequest } from "../../utils/customRequest";
import httpStatus from "http-status";

export const createOrder = catchAsync(async (req: CustomRequest, res: Response ) => {
  const  orderData  = req.body;
  const {id : userId} = req.user;
  const result = await createOrderInToDB(orderData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});