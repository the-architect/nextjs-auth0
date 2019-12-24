"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cookies_1 = require("../utils/cookies");
function callbackHandler(settings, clientProvider, sessionStore) {
    return (req, res, options) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!res) {
            throw new Error('Response is not available');
        }
        if (!req) {
            throw new Error('Request is not available');
        }
        // Parse the cookies.
        const cookies = cookies_1.parseCookies(req);
        // Require that we have a state.
        const state = cookies['a0:state'];
        if (!state) {
            throw new Error('Invalid request, an initial state could not be found');
        }
        // Execute the code exchange
        const client = yield clientProvider();
        const params = client.callbackParams(req);
        const tokenSet = yield client.callback(settings.redirectUri, params, {
            state
        });
        // Get the claims without any OIDC specific claim.
        const claims = tokenSet.claims();
        if (claims.aud) {
            delete claims.aud;
        }
        if (claims.exp) {
            delete claims.exp;
        }
        if (claims.iat) {
            delete claims.iat;
        }
        if (claims.iss) {
            delete claims.iss;
        }
        // Create the session.
        const session = {
            user: Object.assign({}, claims),
            idToken: tokenSet.id_token,
            accessToken: tokenSet.access_token,
            refreshToken: tokenSet.refresh_token,
            createdAt: Date.now()
        };
        // Create the session.
        yield sessionStore.save(req, res, session);
        // Redirect to the homepage.
        const redirectTo = (options && options.redirectTo) || '/';
        res.writeHead(302, {
            Location: redirectTo
        });
        res.end();
    });
}
exports.default = callbackHandler;
//# sourceMappingURL=callback.js.map