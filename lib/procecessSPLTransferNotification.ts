import { getFCMToken } from "../db";
import { Cluster, getTokenInfo } from "./getTokenInfo";
import sendNotification, {
  type SendNotificationOptions,
} from "./sendNotification";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
export type TokenTransfers = Array<{
  fromTokenAccount: string;
  fromUserAccount: string;
  mint: string;
  toTokenAccount: string;
  toUserAccount: string;
  tokenAmount: number;
  tokenStandard: string;
}>;

interface TokenDetails {
  symbol: string;
  name: string;
}

export async function processSPLTransferNotifications(
  tokenTransfers: TokenTransfers,
): Promise<void> {
  for (const transfer of tokenTransfers) {
    await sendSPLTransferNotifications(transfer);
  }
}

async function sendSPLTransferNotifications(
  transfer: TokenTransfers[0],
): Promise<void> {
  console.log("SPL Token Transfer received:");

  const sendNotificationForSender =
    await buildSPLNotificationMessageForSender(transfer);
  const sendNotificationForReceiver =
    await buildSPLNotificationMessageForReceiver(transfer);

  if (sendNotificationForSender) {
    await sendNotification(sendNotificationForSender);
  }
  if (sendNotificationForReceiver) {
    await sendNotification(sendNotificationForReceiver);
  }
}

async function buildSPLNotificationMessageForSender(
  transfer: TokenTransfers[0],
): Promise<SendNotificationOptions | null> {
  const sendFromPubKey = transfer.fromUserAccount;
  const fromUserFCMToken = await getFCMToken(sendFromPubKey);

  if (fromUserFCMToken) {
    const tokenDetails = await getTokenInfo(
      new PublicKey(transfer.mint),
      Cluster.Devnet,
      clusterApiUrl("devnet"),
    );
    const to = transfer.toUserAccount;
    return {
      title: `🙂 You sent ${transfer.tokenAmount} ${tokenDetails?.symbol ?? "Unknow Token"} `,
      fcmToken: fromUserFCMToken,
      image: tokenDetails?.logoURI ?? undefined,
      body: `You successfully sent ${transfer.tokenAmount} ${tokenDetails?.symbol ?? "Unknow Token"} to ${to}.`,
    };
  }
  return null;
}

async function buildSPLNotificationMessageForReceiver(
  transfer: TokenTransfers[0],
): Promise<SendNotificationOptions | null> {
  const sentToPubKey = transfer.toUserAccount;
  const toUserFCMToken = await getFCMToken(sentToPubKey);

  if (toUserFCMToken) {
    const tokenDetails = await getTokenInfo(
      new PublicKey(transfer.mint),
      Cluster.Devnet,
      clusterApiUrl("devnet"),
    );

    const from = transfer.fromUserAccount;

    return {
      title: `🤑 You received ${transfer.tokenAmount} ${tokenDetails?.symbol ?? "Unknown Token"}`,
      fcmToken: toUserFCMToken,
      image: tokenDetails?.logoURI ?? undefined,
      body: `${from} sent you ${transfer.tokenAmount} ${tokenDetails?.symbol ?? "Unknown Token"}`,
    };
  }
  return null;
}
