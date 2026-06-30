/** Google Identity Services (https://accounts.google.com/gsi/client) */
export {};

interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
  error_callback?: (error: unknown) => void;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
  error?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

interface GoogleAccountsOAuth2 {
  initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient;
  revoke: (accessToken: string, done: () => void) => void;
}

interface GoogleAccounts {
  oauth2: GoogleAccountsOAuth2;
}

interface GoogleGis {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google?: GoogleGis;
  }
}
