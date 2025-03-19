// Base64 encoding/decoding functions
const base64UrlEncode = (str: string): string => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const base64UrlDecode = (str: string): string => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return atob(str);
};

// Create a simple JWT implementation
export const jwt = {
    sign(payload: any, secret: string): string {
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };

        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));

        // Create signature using HMAC-SHA256
        const signature = base64UrlEncode(
            btoa(
                String.fromCharCode.apply(
                    null,
                    new Uint8Array(
                        crypto.subtle.sign(
                            'HMAC',
                            crypto.subtle.importKey(
                                'raw',
                                new TextEncoder().encode(secret),
                                'HMAC',
                                false,
                                ['sign']
                            ),
                            new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
                        )
                    )
                )
            )
        );

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    },

    verify(token: string, secret: string): any {
        try {
            const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
            const header = JSON.parse(base64UrlDecode(encodedHeader));
            const payload = JSON.parse(base64UrlDecode(encodedPayload));

            // Verify signature
            const signature = base64UrlEncode(
                btoa(
                    String.fromCharCode.apply(
                        null,
                        new Uint8Array(
                            crypto.subtle.sign(
                                'HMAC',
                                crypto.subtle.importKey(
                                    'raw',
                                    new TextEncoder().encode(secret),
                                    'HMAC',
                                    false,
                                    ['sign']
                                ),
                                new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
                            )
                        )
                    )
                )
            );

            if (signature !== encodedSignature) {
                throw new Error('Invalid signature');
            }

            // Check expiration if present
            if (payload.exp && payload.exp < Date.now() / 1000) {
                throw new Error('Token expired');
            }

            return payload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    },
}; 