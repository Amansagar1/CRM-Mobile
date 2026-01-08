import { ENV } from '@/config/env';
import CryptoJS from 'crypto-js';

/**
 * Decryption Utility
 * Specifically handles Fernet-style encryption (AES-128-CBC + HMAC-SHA256)
 */
export class DecryptionService {
  private key: string;

  constructor() {
    this.key = ENV.ENCRYPTION_KEY;
  }

  /**
   * Decrypts a Fernet-encrypted string
   * Note: Fernet uses AES-128-CBC with a 32-byte key (16 for signing, 16 for encryption)
   * The provided key is base64 encoded.
   */
  decrypt(encryptedData: string): string {
    try {
      if (!encryptedData) return '';

      // Normalize URL-safe base64 for the key
      const normalizedKey = this.key.replace(/-/g, '+').replace(/_/g, '/');
      const keyBuffer = CryptoJS.enc.Base64.parse(normalizedKey);
      
      // Fernet key (32 bytes) = [16 bytes HMAC] + [16 bytes AES Encryption]
      // Words are 4 bytes each. Skip first 4 words (16 bytes) to get encryption key.
      const encryptionKey = CryptoJS.lib.WordArray.create(keyBuffer.words.slice(4, 8));

      // Decode the data from URL-safe base64
      const normalizedData = encryptedData.replace(/-/g, '+').replace(/_/g, '/');
      const dataBuffer = CryptoJS.enc.Base64.parse(normalizedData);
      
      // Convert to hex for precise byte-level slicing
      const dataHex = CryptoJS.enc.Hex.stringify(dataBuffer);

      // Fernet structure (byte offsets):
      // 0: Version (1 byte)
      // 1-8: Timestamp (8 bytes)
      // 9-24: IV (16 bytes)
      // 25-(len-32): Ciphertext (N bytes)
      // (len-32)-len: HMAC (32 bytes)
      
      // Hex offsets (2 chars per byte):
      // IV: begins at index 18 (byte 9), 32 chars long (16 bytes)
      const ivHex = dataHex.substring(18, 18 + 32);
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      
      // Ciphertext: begins at index 50 (byte 25), ends 64 chars from the end (32 bytes HMAC)
      const ciphertextHex = dataHex.substring(50, dataHex.length - 64);
      const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex);

      // Decrypt using AES-CBC
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext } as any,
        encryptionKey,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedStr) {
        throw new Error('Decryption resulted in empty string. Check your key.');
      }
      return decryptedStr;
    } catch (error: any) {
      console.error('Decryption failed:', error.message);
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }
}

export const decryptionService = new DecryptionService();
