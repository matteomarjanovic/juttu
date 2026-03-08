import 'dotenv/config';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = process.env.PUBLIC_HOSTNAME;

if (!baseUrl) {
    console.error('Error: PUBLIC_HOSTNAME environment variable is not set');
    process.exit(1);
}

const metadata = {
    client_id: `https://${baseUrl}/oauth-client-metadata.json`,
    client_name: 'Juttu',
    client_uri: `https://${baseUrl}`,
    logo_uri: `https://${baseUrl}/logo.png`,
    tos_uri: `https://${baseUrl}/tos`,
    policy_uri: `https://${baseUrl}/policy`,
    redirect_uris: [`https://${baseUrl}/callback`],
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    application_type: 'web',
    dpop_bound_access_tokens: true
};

const outputPath = join(__dirname, '..', 'static', 'oauth-client-metadata.json');
writeFileSync(outputPath, JSON.stringify(metadata, null, 4) + '\n');

console.log(`✓ Generated oauth-client-metadata.json with base URL: ${baseUrl}`);
