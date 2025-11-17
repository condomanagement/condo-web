import { create, get } from '@github/webauthn-json';

export interface PasskeyCredential {
  id: number;
  nickname: string;
  created_at: string;
  last_used_at?: string;
  credential_type: string;
}

export function isPasskeySupported(): boolean {
  return window?.PublicKeyCredential !== undefined &&
         typeof window.PublicKeyCredential === 'function';
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isPasskeySupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function registerPasskey(options: unknown): Promise<unknown> {
  return await create(options as CredentialCreationOptionsJSON);
}

export async function authenticateWithPasskey(options: unknown): Promise<unknown> {
  return await get(options as CredentialRequestOptionsJSON);
}

export function getDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) return 'Android Device';
  if (/Chrome/.test(ua) && !/Edge/.test(ua)) return 'Chrome on Desktop';
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari on Desktop';
  if (/Firefox/.test(ua)) return 'Firefox on Desktop';
  if (/Edge/.test(ua)) return 'Edge on Desktop';
  return 'This Device';
}

// Import types from @github/webauthn-json
type CredentialCreationOptionsJSON = import('@github/webauthn-json').CredentialCreationOptionsJSON;
type CredentialRequestOptionsJSON = import('@github/webauthn-json').CredentialRequestOptionsJSON;
