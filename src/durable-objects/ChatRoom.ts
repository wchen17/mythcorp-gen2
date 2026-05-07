/**
 * ChatRoom Durable Object - one instance per room id (we use 'global').
 *
 * Uses the Hibernation API: `state.acceptWebSocket(server)` lets the runtime
 * suspend the DO when sockets are idle, then route incoming frames to the
 * `webSocketMessage` handler without spinning the DO back up unnecessarily.
 *
 * The last 50 messages live in `state.storage` so newcomers see backlog.
 */

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  ts: number;
}

const HISTORY_KEY = 'history';
const MAX_HISTORY = 50;

type DurableObjectState = {
  acceptWebSocket(server: WebSocket): void;
  getWebSockets(): WebSocket[];
  storage: {
    get<T = unknown>(key: string): Promise<T | undefined>;
    put<T = unknown>(key: string, value: T): Promise<void>;
  };
};

export class ChatRoom {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const upgrade = request.headers.get('Upgrade');
    if (upgrade !== 'websocket') {
      return new Response('expected websocket upgrade', { status: 426 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.state.acceptWebSocket(server);

    // Send the recent history so newly-connected clients land in-context.
    const history = (await this.state.storage.get<ChatMessage[]>(HISTORY_KEY)) ?? [];
    if (history.length > 0) {
      try {
        server.send(JSON.stringify({ type: 'history', messages: history }));
      } catch {
        /* socket may have closed already; ignore */
      }
    }

    return new Response(null, { status: 101, webSocket: client } as ResponseInit & { webSocket: WebSocket });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
    let parsed: { user?: unknown; text?: unknown };
    try {
      parsed = typeof raw === 'string' ? JSON.parse(raw) : { text: '' };
    } catch {
      return;
    }
    const user = typeof parsed.user === 'string' ? parsed.user.slice(0, 32) : 'guest';
    const text = typeof parsed.text === 'string' ? parsed.text.slice(0, 1024) : '';
    if (!text.trim()) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      user,
      text,
      ts: Date.now(),
    };

    // Append to history with a cap.
    const history = (await this.state.storage.get<ChatMessage[]>(HISTORY_KEY)) ?? [];
    const next = [...history, msg].slice(-MAX_HISTORY);
    await this.state.storage.put(HISTORY_KEY, next);

    const payload = JSON.stringify({ type: 'message', message: msg });
    for (const peer of this.state.getWebSockets()) {
      try {
        peer.send(payload);
      } catch {
        /* one bad peer shouldn't block the rest */
      }
    }
    void ws;
  }

  async webSocketClose(ws: WebSocket, code: number) {
    try {
      ws.close(code, 'closing');
    } catch {
      /* already closed */
    }
  }

  async webSocketError(ws: WebSocket) {
    try {
      ws.close(1011, 'error');
    } catch {
      /* already closed */
    }
  }
}
