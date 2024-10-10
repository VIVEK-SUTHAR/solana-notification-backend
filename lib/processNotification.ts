import { getFCMToken } from "../db";
import { SOL_IMAGE_URL } from "./constants";
import type { TokenTransfers } from "./procecessSPLTransferNotification";
import sendNotification, {
  type SendNotificationOptions,
} from "./sendNotification";

type NativeTransfer = {
  amount: number;
  fromUserAccount: string;
  toUserAccount: string;
};

export type ProcessTransferNotificationKey = {
  feePayer: string;
  signature: string;
  amount: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfers;
};

export default async function processTransferNotification(
  options: ProcessTransferNotificationKey,
) {
  const transfers = options.nativeTransfers;
  for (const transfer of transfers) {
    await sendTransferNotifications(transfer);
  }
}

async function sendTransferNotifications(
  transfer: NativeTransfer,
): Promise<void> {
  const sendNotificationForSender =
    await buildNotificationMessageForSender(transfer);

  const sendNotificationForReceiver =
    await buildNotificationMessageForReceiver(transfer);

  if (sendNotificationForSender) {
    await sendNotification(sendNotificationForSender);
  }

  if (sendNotificationForReceiver) {
    await sendNotification(sendNotificationForReceiver);
  }
}

async function buildNotificationMessageForSender(
  transfer: NativeTransfer,
): Promise<SendNotificationOptions | null> {
  const sendFromPubKey = transfer.fromUserAccount;
  const fromUserFCMToken = await getFCMToken(sendFromPubKey);

  if (fromUserFCMToken) {
    const amountSent = transfer.amount / 1000000000;
    const to = transfer.toUserAccount;

    return {
      title: `🙂 You sent ${amountSent} SOL`,
      fcmToken: fromUserFCMToken,
      image: SOL_IMAGE_URL,
      body: `You successfully sent ${amountSent} SOL to ${to}.`,
    };
  }

  return null;
}

async function buildNotificationMessageForReceiver(
  transfer: NativeTransfer,
): Promise<SendNotificationOptions | null> {
  const sentToPubKey = transfer.toUserAccount;
  const toUserFCMToken = await getFCMToken(sentToPubKey);

  if (toUserFCMToken) {
    const amountReceived = transfer.amount / 1000000000;
    const from = transfer.fromUserAccount;

    return {
      title: `🤑 You received ${amountReceived} SOL`,
      fcmToken: toUserFCMToken,
      image: SOL_IMAGE_URL,
      body: `${from} sent you ${amountReceived} SOL.`,
    };
  }

  return null;
}
