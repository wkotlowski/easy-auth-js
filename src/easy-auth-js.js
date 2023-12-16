import {
  generateCodeVerifier,
  generateCodeChallenge,
} from "./utils/pkce.utils.js";

class EasyAuth {
  constructor(config) {
    // Your authorization server's OAuth /authorize endpoint
    this.authorizeEndpoint = config.authorizeEndpoint;
    // Your authorization server's OAuth /token endpoint
    this.tokenEndpoint = config.tokenEndpoint;
    // Client application identifier
    this.clientID = config.clientID;
    // An absolute URI where you want the user to be redirected to
    this.redirectURI = config.redirectURI;
    // Random state for CSRF protection
    this.state = this.generateRandomState();
    this.scopes = config.scopes || [];
  }

  // A function to generate a random string for CSRF protection
  generateRandomState() {
    let randomState = Math.random().toString(36).substring(2, 15);
    return randomState;
  }

  // Redirect the user the server's OAuth authorization endpoint using PKCE
  async authorize() {
    const codeVerifier = generateCodeVerifier();
    sessionStorage.setItem("codeVerifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    sessionStorage.setItem("codeChallenge", codeChallenge);

    sessionStorage.setItem("oauthState", this.state);

    const scopeString = this.scopes.join(' ');

    let authorizeCompleteURI = new URL(
      this.authorizeEndpoint +
        "?" +
        new URLSearchParams({
          response_type: "code",
          redirect_uri: this.redirectURI,
          client_id: this.clientID,
          code_challenge: sessionStorage.getItem("codeChallenge"),
          code_challenge_method: "S256",
          state: this.state,
          scope: scopeString
        })
    );

    window.location.href = authorizeCompleteURI;
  }

  async getAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const returnedState = urlParams.get("state");

    if (code && returnedState === sessionStorage.getItem("oauthState")) {
      const tokenData = await this.fetchTokenFromAS(code);
      window.history.replaceState(null, null, window.location.pathname);
      return tokenData;
    } else {
      const accessToken = this.getAccessToken();
      if (!accessToken || this.isTokenExpired()) {
        console.log("No valid token found or token is expired");
        // Logic for when there is no valid token
      } else {
        return { access_token: accessToken };
      }
    }
  }

  async fetchTokenFromAS(code) {
    const codeVerifier = sessionStorage.getItem("codeVerifier");

    const tokenResponse = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: this.redirectURI,
        client_id: this.clientID,
        code_verifier: codeVerifier
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    localStorage.setItem("accessToken", tokenData.access_token);
    localStorage.setItem("refreshToken", tokenData.refresh_token);
    localStorage.setItem("idToken", tokenData.id_token);

    if (tokenData.access_token.expires_in) {
      const expiryTime = Date.now() + tokenData.expires_in * 1000;
      localStorage.setItem("tokenExpiry", expiryTime.toString());
    }

    return tokenData;
  }

  // Clear tokens from local storage
  logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('tokenExpiry');
  }

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  getIdToken() {
    return localStorage.getItem("idToken");
  }

  isTokenExpired() {
    const expiryTime = localStorage.getItem("tokenExpiry");
    return expiryTime && Date.now() > parseInt(expiryTime);
  }

  onTokenInvalid(callback) {
    this.tokenInvalidCallback = callback;
  }
}

export { EasyAuth };
