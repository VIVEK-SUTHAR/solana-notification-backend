const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const ADDRESS_LISTENER_WEBHOOK_ID = process.env.WEBHOOK_ID;
const WEBHOOK_POST_URL = "https://e66a-103-250-159-164.ngrok-free.app";
if (!ADDRESS_LISTENER_WEBHOOK_ID || !HELIUS_API_KEY) {
  console.log("HELIUS_API_KEY or ADDRESS_LISTENER_WEBHOOK_ID not set");
  process.exit(1);
}
const getWebhookByID = async (webhookId: string) => {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks/${webhookId}?api-key=${HELIUS_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("error", e);
  }
};
const addAddressToWebHook = async (address: string) => {
  try {
    const existing = await getWebhookByID(ADDRESS_LISTENER_WEBHOOK_ID);
    console.log("existing address", existing.accountAddresses);

    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks/${ADDRESS_LISTENER_WEBHOOK_ID}?api-key=${HELIUS_API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookURL: WEBHOOK_POST_URL,
          webhookType: "enhancedDevnet",
          transactionTypes: ["Any"],
          accountAddresses: [...existing.accountAddresses, address],
        }),
      },
    );
    const data = await response.json();
    console.log("Subscribed :", address);
  } catch (e) {
    throw e;
  }
};

export default addAddressToWebHook;
