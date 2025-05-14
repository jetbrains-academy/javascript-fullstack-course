We’ve almost finished our backend! 
Everything already works, but for now, anyone can send a message on behalf of any user. This is unacceptable.

In this lesson, you will learn how to:
- Implement simple authentication for routes and WebSockets using JWT.

### JWT
To implement authentication, we need a way to identify requests coming to our routes.
It would be convenient if each request contained some special information to indicate which user the request is actually from, 
and if this information were tamper-proof. The simplest way to achieve this is using [JWT](https://jwt.io/) (JSON Web Tokens).

<div style="text-align: center; max-width:400px; margin: 0 auto; ">
<img src="images/jwt_logo.svg">
</div>

A token might look like this but longer:
```text
eyJhbGcikpXVCJ9.eyJ3ODkwMjM5MDIyfQ.SflKxw_adQssw5c
```

It consists of three encoded parts, separated by dots:
- **Header**: Specifies the type of token (JWT) and the algorithm used for signing (e.g., HS256 or RS256).
- **Payload**: Contains the actual data (called "claims"), like user information or permissions. We’ll store the username here.
- **Signature**: A cryptographic signature generated using the header, payload, and a secret key. This ensures the token hasn’t been tampered with.

During authorization, we can issue a token to the user that is signed using our secret key, and they must present this token with each request.
Since the payload of the token is not encrypted, its data can be easily read. Keeping the secret key private allows only us 
to verify the token's authenticity and confirm that it was issued by us for a specific user.

<div class="hint" title="OAuth">

  For larger applications, [OAuth](https://oauth.net/2/) is commonly used instead of JWT.
  OAuth is an open standard for authorization that allows third-party applications to access user data without exposing their credentials. It works by delegating access via tokens issued by an authorization server.

  OAuth is more flexible but also more complex. For a simple application like ours, using JWT is enough.
</div>
