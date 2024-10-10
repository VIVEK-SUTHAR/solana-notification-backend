import type { Request, Response } from "express";
import { storeFCMToken } from "../db";
import processTransferNotification from "../lib/processNotification";
import { processSPLTransferNotifications } from "../lib/procecessSPLTransferNotification";

export default async function processWebHook(req: Request, res: Response) {
  const data = req.body;
  if (data?.length > 0 && data[0] && data[0].type === "TRANSFER") {
    switch (data[0].source) {
      case "SOLANA_PROGRAM_LIBRARY":
        processSPLTransferNotifications(data[0].tokenTransfers);
        break;
      case "SYSTEM_PROGRAM":
        processTransferNotification(data[0]);
        break;
    }
  }
  res.sendStatus(200);
}
