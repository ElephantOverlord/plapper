import Pusher, { Channel } from "pusher-js";

export default function (code: string): Channel {
  return new Pusher(import.meta.env.VITE_SOKETI_KEY as string, {
    wsHost: import.meta.env.VITE_SOKETI_HOST as string,
    wsPort: Number.parseInt(import.meta.env.VITE_SOKETI_PORT as string),
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  }).subscribe(code);
}
