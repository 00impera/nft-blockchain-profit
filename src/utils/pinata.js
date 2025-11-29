import axios from "axios";

const PINATA_API_KEY = "b831f3b9a2d859df00fc";
const PINATA_SECRET_API_KEY =
  "238033d405b10283e4a617c6238e15f8b03cafb0b37be62a0819f1f3bdab90d4";

// Upload image (base64 or file URI) to Pinata
export async function uploadImageToPinata(imageUri) {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    name: "nft-image.png",
    type: "image/png",
  });

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    },
  );
  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

// Upload metadata JSON to Pinata
export async function uploadJSONToPinata(metadata) {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );
  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

