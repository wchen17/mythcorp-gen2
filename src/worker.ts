/**
 * Custom Worker entrypoint that wraps the OpenNext-Cloudflare bundle.
 *
 * Why this exists:
 *  - WebSocket upgrades cannot pass through Next.js Route Handlers in the
 *    OpenNext adapter (the `webSocket` property on Response is dropped).
 *  - We intercept `/api/chat` upgrades here and route them straight to the
 *    `ChatRoom` Durable Object before OpenNext sees the request.
 *  - Everything else falls through to the OpenNext-built handler unchanged.
 *
 * The DO `ChatRoom` is also re-exported here so Cloudflare can instantiate
 * it from this same Worker bundle (single-bundle requirement for DOs).
 *
 * Build order: `opennextjs-cloudflare build` produces `.open-next/worker.js`
 * before wrangler bundles this file.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - generated file at build time
import openNextWorker from '../.open-next/worker.js';
import { ChatRoom } from './durable-objects/ChatRoom';

export { ChatRoom };

interface Env {
  CHAT_ROOM: DurableObjectNamespace;
}

type DurableObjectNamespace = {
  idFromName(name: string): DurableObjectId;
  get(id: DurableObjectId): { fetch: (req: Request) => Promise<Response> };
};
type DurableObjectId = unknown;

const handler = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.headers.get('Upgrade') === 'websocket') {
      const id = env.CHAT_ROOM.idFromName('global');
      const stub = env.CHAT_ROOM.get(id);
      return stub.fetch(request);
    }

    // Fall through to the OpenNext-generated handler for everything else.
    return openNextWorker.fetch(request, env, ctx);
  },
};

export default handler;
