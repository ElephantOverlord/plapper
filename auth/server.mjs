import { createHmac } from "node:crypto";
import { createServer } from "node:http";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 9120);
const appKey = process.env.SOCKUDO_DEFAULT_APP_KEY;
const appSecret = process.env.SOCKUDO_DEFAULT_APP_SECRET;

if (!appKey || !appSecret) {
  throw new Error("SOCKUDO_DEFAULT_APP_KEY and SOCKUDO_DEFAULT_APP_SECRET are required");
}

function json(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": process.env.CORS_ORIGIN ?? "*",
  });
  response.end(JSON.stringify(body));
}

function authorizedSignature(socketId, channelName) {
  return createHmac("sha256", appSecret)
    .update(`${socketId}:${channelName}`)
    .digest("hex");
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-origin": process.env.CORS_ORIGIN ?? "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    return response.end();
  }

  if (request.method !== "POST" || request.url !== "/broadcasting/auth") {
    return json(response, 404, { error: "Not found" });
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = new URLSearchParams(Buffer.concat(chunks).toString());
  const socketId = body.get("socket_id");
  const channelName = body.get("channel_name");

  // This application currently has anonymous players. The game code is the
  // access token, so only sign the private game channels used by the client.
  if (
    !socketId ||
    !/^\d+(?:\.\d+)?$/.test(socketId) ||
    !channelName ||
    !/^private-[A-Za-z0-9_-]{4,64}$/.test(channelName)
  ) {
    return json(response, 403, { error: "Invalid channel authorization request" });
  }

  const signature = authorizedSignature(socketId, channelName);
  return json(response, 200, { auth: `${appKey}:${signature}` });
});

server.listen(port, host, () => {
  console.log(`Sockudo auth server listening on ${host}:${port}`);
});
