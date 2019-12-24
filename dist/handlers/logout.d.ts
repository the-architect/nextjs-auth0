/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import IAuth0Settings from '../settings';
export default function logoutHandler(settings: IAuth0Settings): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
