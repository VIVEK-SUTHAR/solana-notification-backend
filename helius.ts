import { Helius } from "helius-sdk";

const helius = new Helius("YOUR_API_KEY");
const response = await helius.rpc.getAssetsByOwner({
  ownerAddress: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
  page: 1,
});
