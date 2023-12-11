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

    if (window.location.search.includes('code=')) {
      this.handleRedirect();
    }
  }




  // A function to generate a random string for CSRF protection
  generateRandomState() {
    // let randomState = '';

    // const randomValues = new Uint32Array(16);

    // window.crypto.getRandomValues(randomValues);
    // randomValues.forEach((value) => {
    //    randomState += characters.charAt(value % charactersLength);
    //  });
    let randomState = Math.random().toString(36).substring(2, 15);
    console.log(randomState);
    return randomState;
  }

  // Call the server's OAuth authorization endpoint using PKCE
  authorize() {
    sessionStorage.setItem("codeVerifier", generateCodeVerifier());
    sessionStorage.setItem(
      "code",
      generateCodeChallenge(sessionStorage.getItem("codeVerifier"))
    );

    let authorizeCompleteURI = new URL(
      this.authorizeEndpoint +
        "?" +
        new URLSearchParams({
          response_type: "code",
          redirect_uri: this.redirectURI,
          client_id: this.clientID,
          code_challenge: sessionStorage.getItem("code"),
          code_challenge_method: "S256",
          state: this.state,
        })
    );

    window.location.href = authorizeCompleteURI;
  }

  handleRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    console.log('code is:' + code);

   //  if (code) {
   //    // We have an authorization code, proceed to fetch the token
   //    fetchToken(code, state)
   //      .then((token) => {
   //        // Handle the fetched token (e.g., store it, redirect to a protected page)
   //      })
   //      .catch((error) => {
   //        // Handle errors (e.g., show an error message)
   //      });
   //  }
  }

  fetchTokenFromAS(config, code) {
    console.log(code);
  }
}

export { EasyAuth };
