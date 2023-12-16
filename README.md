# EasyAuth - OAuth Simplified for JavaScript SPAs

EasyAuth is a lightweight, easy-to-use JavaScript library designed to simplify the implementation of OAuth authentication in Single Page Applications (SPAs). It abstracts the complexities of OAuth flows, particularly for handling the Authorization Code flow with PKCE, making it easier for developers to securely implement user authentication.

## Features

- Easy integration with OAuth 2.0 authorization servers.
- Supports Authorization Code flow with PKCE.
- Handles token storage and retrieval.
- Simplifies token refresh and expiration checks.

## Installation

To install EasyAuth, use npm:

```bash
npm install easy-auth-js
```

## Usage

Here's a basic guide on how to use EasyAuth in your application:

## Initialize EasyAuth

First, import and initialize the EasyAuth class with your configuration.

```javascript
import { EasyAuth } from 'easy-auth-js';

const easyAuth = new EasyAuth({
  authorizeEndpoint: 'https://example.com/oauth2/authorize',
  tokenEndpoint: 'https://example.com/oauth2/token',
  clientID: 'your-client-id',
  redirectURI: 'https://yourapp.com/callback',
  scopes: ['openid', 'profile', 'email']
});
```

## Authorize

Invoke the authorize method to redirect the user to the OAuth provider's authorization page.

Typically, you would add a sign-in button that, when selected, redirects the user to the configured OAuth redirect URL. Under the hood, the authorization server's API is called.

```javascript
easyAuth.authorize();
```

## Handle Authentication Response

After the user is redirected back to your application, use `getAuth()` to handle the authentication response.

Example:

```javascript
easyAuth.getAuth().then(tokenData => {
  // Handle successful authentication
  console.log(tokenData);
}).catch(error => {
  // Handle errors
  console.error(error);
});
```

## Logout

To log out the user and clear tokens, use the logout method.

```javascript
easyAuth.logout();
```

## Handling Token Expiration

EasyAuth provides a callback mechanism that can be used to define custom behavior when the token becomes invalid or expires. This is particularly useful to manage user experience when a session ends or to initiate a token refresh process.

### Setting Up the Token Expiration Callback

Use the `onTokenInvalid` method to set a callback that will be triggered when the token is detected as invalid or expired.

```javascript
easyAuth.onTokenInvalid(() => {
  // Custom logic when the token is invalid or expired
  alert("Your session has expired. Please log in again.");
});
```

## Contributing

Contributions to EasyAuth are welcome! Please refer to the CONTRIBUTING.md file for guidelines.

## License

EasyAuth is MIT licensed. See the LICENSE file for details.

## Disclaimer

This library is provided "as is", without warranty of any kind. Use at your own risk.
