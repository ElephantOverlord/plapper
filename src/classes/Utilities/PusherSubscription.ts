import Pusher, { Channel } from "pusher-js";

export default function (code: string): Channel {
  return new Pusher(import.meta.env.VITE_SOCKUDO_KEY as string, {
    wsHost: import.meta.env.VITE_SOCKUDO_HOST as string,
    wsPort: Number.parseInt(import.meta.env.VITE_SOCKUDO_PORT as string),
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  }).subscribe(code);
}
