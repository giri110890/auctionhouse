import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
// import { Web3Storage } from "web3.storage";

export async function UploadFilesWeb3(imageUrl, title, description, accountAddress) {

  //   const filearr = [file];
  const metadataFile = jsonFile("info.json", {
    path: imageUrl,
    title,
    description,
    owner: accountAddress,
    timestamp: Date().toString(),
  });
  const storage = getStorge();
  const cid = await storage.put(metadataFile);

}

function jsonFile(filename, obj) {
  return new File([JSON.stringify(obj)], filename);
}

export async function getImageMetadata(cid) {
  const url = makeGatewayURL(cid, "info.json");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `error fetching image metadata: [${res.status}] ${res.statusText}`
    );
  }
  const metadata = await res.json();
  const gatewayURL = makeGatewayURL(cid, metadata.path);
  return { ...metadata, cid, gatewayURL };
}
export async function getFiles() {
  const filesData = [];
  for await (const upload of getStorge().list()) {
    try {
      const metadata = await getImageMetadata(upload.cid);
      filesData.push(metadata);
    } catch (e) {
      console.error("error getting image metadata:", e);
      continue;
    }
  }
  return filesData;
}
export function getStorge() {
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNEMjA2NUE4ZWE5MWY5RTFhRWRlMkVlYTAzQkZERDQ0NDk1MURjNzkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzA2NzgyNDcyNjcsIm5hbWUiOiJNZXRhYnVpZGwifQ.jS08gm_lyxhkawrdqsRzuTkaXQO7hmk2VOEx5b4vjCM";
  return new Web3Storage({ token: accessToken });
}
export async function deleteFile(cid) {
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNEMjA2NUE4ZWE5MWY5RTFhRWRlMkVlYTAzQkZERDQ0NDk1MURjNzkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzA2NzgyNDcyNjcsIm5hbWUiOiJNZXRhYnVpZGwifQ.jS08gm_lyxhkawrdqsRzuTkaXQO7hmk2VOEx5b4vjCM";
  const storage = new Web3Storage({ token: accessToken });
  storage.delete(cid);
}
function makeGatewayURL(cid, path) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
}