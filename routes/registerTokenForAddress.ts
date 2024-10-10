import type { Request, Response } from "express";
import { storeFCMToken } from "../db";
import addAddressToWebHook from "../lib/addAddressToWebHook";

export default async function registerTokenForAddress(
  req: Request,
  res: Response,
) {
  try {
    const { address, token } = req.body;

    if (!address || !token) {
      return res.status(400).json({
        error: "Address and token are required",
      });
    }
    await addAddressToWebHook(address);
    await storeFCMToken(address, token);
    res.status(200).json({
      message: "Registered",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
