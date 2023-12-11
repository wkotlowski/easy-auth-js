import { generateCodeVerifier, generateCodeChallenge } from './utils/pkce.utils.js';

class OAuthConfig {
   constructor(config) {
      // Your authorization server's OAuth /authorize endpoint
      this.authorizeEndpoint = config.authorizeEndpoint;
      // Your authorization server's OAuth /token endpoint
      this.tokenEndpoint = config.tokenEndpoint;
      // Client application identifier
      this.clientID = config.clientID
      // An absolute URI where you want the user to be redirected to
      this.redirectURI = config.redirectURI;
      // Random state for CSRF protection
      this.state = this.generateRandomState();
   }

   // A function to generate a random string for CSRF protection
   generateRandomState() {
      // let randomState = '';

      // const randomValues = new Uint32Array(16);

      // window.crypto.getRandomValues(randomValues);
      // randomValues.forEach((value) => {
      //    randomState += characters.charAt(value % charactersLength);
      //  });
       return Math.random().toString(36).substring(2, 15);;
  }
}

// Call the server's OAuth authorization endpoint using PKCE
async function authorize(config) {

   const codeVerifier = generateCodeVerifier();
   sessionStorage.setItem("code", await generateCodeChallenge(codeVerifier));

   let authorizeCompleteURI = new URL(config.authorizeEndpoint+ '?' + new URLSearchParams({
                 response_type: 'code',
                 redirect_uri: config.redirectURI,
                 client_id: config.clientID,
                 code_challenge: sessionStorage.getItem("code"),
                 code_challenge_method: 'S256',
                 state: config.state
   }));
   
   window.location.href = authorizeCompleteURI;
}

export { OAuthConfig, authorize };