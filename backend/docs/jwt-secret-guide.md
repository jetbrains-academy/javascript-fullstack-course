# JWT Secret Key Guidelines

## Best Practices for JWT_SECRET

1. **Length**: Use at least 256 bits (32 bytes) of randomness
2. **Complexity**: Should be cryptographically random
3. **Uniqueness**: Use different secrets for different environments
4. **Protection**: Never commit the actual secret to version control
5. **Rotation**: Consider rotating the secret periodically in production

## Using the Secret Generator

1. Run the generator script:
```bash
node scripts/generate-secret.js
```

2. Copy the generated value to your `.env` file:
```env
JWT_SECRET=your-generated-secret
```

## Environment-Specific Guidelines

### Development
- Use the generator script to create a development secret
- It's OK to share this secret among the development team
- Document the development secret in a secure team wiki

### Production
- Use the generator script to create a production secret
- Store the secret in a secure password manager or secrets management system
- Consider using a secrets management service like:
  - AWS Secrets Manager
  - HashiCorp Vault
  - Azure Key Vault

### Testing
- Use a simple, known value for automated tests
- Document the test secret in the test configuration
- Never use test secrets in production

## Security Considerations

1. **Secret Storage**
   - Never store the secret in plain text
   - Use environment variables or secure secret management
   - Restrict access to the secret to only necessary personnel

2. **Secret Rotation**
   - Plan for secret rotation in production
   - Implement a grace period when rotating secrets
   - Consider using multiple valid secrets during rotation

3. **Monitoring**
   - Log JWT validation failures (but not the secret itself)
   - Monitor for unusual patterns in JWT usage
   - Set up alerts for potential security issues

## Example Implementation

```javascript
// Load secret from environment variable
const jwtSecret = process.env.JWT_SECRET;

// Validate secret exists and has minimum length
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is not properly configured');
}
```

## Emergency Procedures

If you suspect the JWT secret has been compromised:

1. Generate a new secret immediately
2. Deploy the new secret to all services
3. Invalidate all existing tokens
4. Monitor for any suspicious activity
5. Document the incident and response

Remember: The security of your JWT tokens depends heavily on keeping this secret secure. Never underestimate the importance of proper secret management.