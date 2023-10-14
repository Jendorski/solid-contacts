import CryptoJS from "crypto-js";

export const encryptString = async (
  payload: string,
  authKey: string
): Promise<string> => {
  const key = CryptoJS.enc.Utf8.parse(authKey);
  const encrypted = CryptoJS.AES.encrypt(payload, key.toString());
  return encrypted.toString();
};

// decrypt data with key
export const decryptString = async (
  cipherText: string,
  authKey: string
): Promise<string> => {
  const key = CryptoJS.enc.Utf8.parse(authKey);
  const bytes = CryptoJS.AES.decrypt(cipherText, key.toString());
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};
