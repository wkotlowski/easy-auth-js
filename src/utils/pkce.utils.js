// Generate Code Verifier as in RFC7636 https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
function generateCodeVerifier() {
   const array = new Uint8Array(32);
   window.crypto.getRandomValues(array);
   return arrayToString(array);
}

// Convert a byte array into a hexadecimal string
function arrayToString(array) {
   return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

async function generateCodeChallenge(verifier) {
   const hashed = await sha256(verifier);
   return base64urlencode(hashed);
}

function base64urlencode(str) {
   return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
       .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(verifier) {
   const encoder = new TextEncoder();
   const data = encoder.encode(verifier);
   return window.crypto.subtle.digest('SHA-256', data);
}

export { generateCodeVerifier, generateCodeChallenge };