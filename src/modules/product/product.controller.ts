import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { createProductToDB, getAllProductsFromDB } from "./product.service";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const  productData  = req.body;
  const result = await createProductToDB(productData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});
export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllProductsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});