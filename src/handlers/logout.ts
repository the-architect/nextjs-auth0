import { IncomingMessage, ServerResponse } from 'http';

import IAuth0Settings from '../settings';
import { setCookies } from '../utils/cookies';

function createLogoutUrl(settings: IAuth0Settings): string {
  return (
    `https://${settings.domain}/v2/logout?` +
    `client_id=${settings.clientId}` +
    `&returnTo=${encodeURIComponent(settings.postLogoutRedirectUri)}`
  );
}

export default function logoutHandler(settings: IAuth0Settings) {
  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!res) {
      throw new Error('Response is not available');
    }

    // Remove the cookies
    setCookies(req, res, [
      {
        name: 'a0:state',
        value: '',
        maxAge: -1
      },
      {
        name: 'a0:session',
        value: '',
        maxAge: -1
      }
    ]);

    // Redirect to the logout endpoint.
    res.writeHead(302, {
      Location: createLogoutUrl(settings)
    });
    res.end();
  };
}
