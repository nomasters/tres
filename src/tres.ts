import { encode, decode } from "@stablelib/utf8";
import { encodeURLSafe, decodeURLSafe } from "@stablelib/base64";
import { generateKey } from "@stablelib/nacl/secretbox";
import { secretbox } from "tweetnacl";
import axios from "axios";

export function getPayload() {
  let payload;
  try {
    payload = document.getElementsByName("payload")[0].getAttribute("content");
  } catch {
    payload = undefined;
  }
  return payload;
}

export function getKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get("k");
}

// encrypt takes a Uint8Array key and message
// and returns Uint8Array encoded nonce + cipherText
export function encrypt(key: Uint8Array, message: Uint8Array) {
  const nonce = generateKey().slice(0, 24);
  const cipherText = secretbox(message, nonce, key);
  return new Uint8Array([...nonce, ...cipherText]);
}

export function decrypt(key: Uint8Array, payload: Uint8Array) {
  const nonce = payload.slice(0, 24);
  const cipherText = payload.slice(24);
  return secretbox.open(cipherText, nonce, key);
}

export function genKeyEncrypt(data: string) {
  const key = generateKey();
  const message = encode(data);
  const cipherText = encrypt(key, message);
  return {
    key: encodeURLSafe(key),
    payload: encodeURLSafe(cipherText)
  };
}

export function decryptEncoded(keyEncoded: string, payloadEncoded: string) {
  const key = decodeURLSafe(keyEncoded);
  const payload = decodeURLSafe(payloadEncoded);
  const message = decrypt(key, payload);
  return decode(message);
}

export function genShareData(payload: string) {
  const title = "TRES is Recursive Encrypted Sharing";
  const js = document.getElementsByTagName("script")[0].textContent;
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />
    <title>${title}</title>
  </head>
  <div name="payload" content="${payload}"></div>
  <style> body {background-color: #eeeeee;}</style>
  <body>
    <div id="root"></div>
    <script type="text/javascript">${js}</script>
  </body>
</html>
`;
}

export function addToIPFS(shareData: string, url: string) {
  const blob = new Blob([shareData], { type: "text/html" });
  const data = new FormData();
  data.append("file", blob);
  const endpoint = `${url}/api/v0/add`;
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };
  return axios.post(endpoint, data, config).then(resp => {
    console.log(resp.data);
    return resp.data.Hash;
  });
}

export function makeShareLink(hash: string, key: string, url: string) {
  return `${url}/ipfs/${hash}?k=${key}`;
}
