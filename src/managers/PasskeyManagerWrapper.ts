import axios from 'axios';
import { create, get } from '@github/webauthn-json';
import type {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
} from '@github/webauthn-json';

export interface PasskeyCredential {
  id: number;
  nickname: string;
  created_at: string;
  last_used_at?: string | null;
  credential_type: string;
}

export interface PasskeyRegistrationResponse {
  success: boolean;
  credential?: PasskeyCredential;
  error?: string;
}

export interface PasskeyAuthenticationResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Wrapper around PasskeyManager that works with cookie-based authentication
 * This fixes the mismatch between condo-brain's email-based approach
 * and condo-api's cookie-based approach
 */
export class PasskeyManagerWrapper {
  /**
   * Register a new passkey for the authenticated user
   * Uses cookie authentication instead of email params
   */
  public async register(token: string, nickname?: string): Promise<PasskeyRegistrationResponse> {
    try {
      console.log('[PasskeyWrapper] Starting registration with token');
      
      // Get registration options from server (uses cookie auth)
      const optionsResponse = await axios.get('/api/webauthn/registration_options');
      const options = optionsResponse.data;
      
      console.log('[PasskeyWrapper] Registration options received:', options);

      // Create the credential using WebAuthn
      console.log('[PasskeyWrapper] Creating credential...');
      const credential = await create(options as CredentialCreationOptionsJSON);
      
      console.log('[PasskeyWrapper] Credential created:', credential);

      // Register the credential with the server
      console.log('[PasskeyWrapper] Registering credential with server...');
      const response = await axios.post<PasskeyRegistrationResponse>(
        '/api/webauthn/register',
        {
          token,
          credential,
          nickname,
        },
      );

      console.log('[PasskeyWrapper] Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PasskeyWrapper] Registration failed:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Registration failed',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown registration error',
      };
    }
  }

  /**
   * Authenticate with a passkey
   */
  public async authenticate(email: string): Promise<PasskeyAuthenticationResponse> {
    try {
      console.log('[PasskeyWrapper] Starting authentication for:', email);
      
      // Get authentication options from server
      const optionsResponse = await axios.get('/api/webauthn/authentication_options', {
        params: { email },
      });
      const options = optionsResponse.data;
      
      console.log('[PasskeyWrapper] Authentication options received:', options);

      // Get the credential using WebAuthn
      console.log('[PasskeyWrapper] Getting credential...');
      const credential = await get(options as CredentialRequestOptionsJSON);
      
      console.log('[PasskeyWrapper] Credential received:', credential);

      // Authenticate with the server
      console.log('[PasskeyWrapper] Authenticating with server...');
      const response = await axios.post<PasskeyAuthenticationResponse>(
        '/api/webauthn/authenticate',
        {
          email,
          credential,
        },
      );

      console.log('[PasskeyWrapper] Authentication successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PasskeyWrapper] Authentication failed:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || 'Authentication failed',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error',
      };
    }
  }

  /**
   * List all passkeys for the authenticated user
   */
  public async list(): Promise<PasskeyCredential[]> {
    try {
      console.log('[PasskeyWrapper] Fetching passkeys list');
      const response = await axios.get<{ credentials: PasskeyCredential[] }>(
        '/api/webauthn/credentials'
      );
      console.log('[PasskeyWrapper] Passkeys fetched:', response.data.credentials);
      return response.data.credentials;
    } catch (error) {
      console.error('[PasskeyWrapper] Failed to fetch passkeys:', error);
      return [];
    }
  }

  /**
   * Delete a passkey
   */
  public async delete(id: number): Promise<boolean> {
    try {
      console.log('[PasskeyWrapper] Deleting passkey:', id);
      await axios.delete(`/api/webauthn/credentials/${id}`);
      console.log('[PasskeyWrapper] Passkey deleted successfully');
      return true;
    } catch (error) {
      console.error('[PasskeyWrapper] Failed to delete passkey:', error);
      return false;
    }
  }

  /**
   * Check if passkeys are available for a user
   */
  public async checkAvailability(email: string): Promise<{ passkeys_available: boolean }> {
    try {
      console.log('[PasskeyWrapper] Checking passkey availability for:', email);
      const response = await axios.get<{ passkeys_available: boolean }>(
        '/api/webauthn/check_availability',
        { params: { email } }
      );
      console.log('[PasskeyWrapper] Availability:', response.data);
      return response.data;
    } catch (error) {
      console.error('[PasskeyWrapper] Failed to check availability:', error);
      return { passkeys_available: false };
    }
  }

  /**
   * List all passkeys for the authenticated user (alias for list)
   */
  public async listCredentials(): Promise<PasskeyCredential[]> {
    return this.list();
  }

  /**
   * Delete a passkey (alias for delete)
   */
  public async deleteCredential(id: number): Promise<boolean> {
    return this.delete(id);
  }

  /**
   * Check if passkeys are supported
   */
  public static isSupported(): boolean {
    return window?.PublicKeyCredential !== undefined &&
           typeof window.PublicKeyCredential === 'function';
  }

  /**
   * Check if platform authenticator is available
   */
  public static async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    if (!PasskeyManagerWrapper.isSupported()) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }
}
