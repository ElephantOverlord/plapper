import Pusher, { Channel } from "pusher-js";
import Player from "../Game/Player";

export default function (code: string, player?: Player): Channel {
  const member = player
    ? { ...player, role: "student" }
    : { id: `teacher-${Date.now()}-${Math.random()}`, role: "teacher" };

  return new Pusher(import.meta.env.VITE_SOCKUDO_KEY as string, {
    wsHost: import.meta.env.VITE_SOCKUDO_HOST as string,
    wsPort: Number.parseInt(import.meta.env.VITE_SOCKUDO_PORT as string),
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    // Sockudo only accepts client events on private or presence channels.
    // The endpoint must sign `socket_id:channel_name` with the Sockudo app
    // secret on the server; the secret must never be exposed to this bundle.
    authEndpoint:
      (import.meta.env.VITE_SOCKUDO_AUTH_ENDPOINT as string) ||
      "/broadcasting/auth",
    auth: {
      params: {
        user_id: member.id,
        user_info: JSON.stringify(member),
      },
    },
  }).subscribe(`presence-${code}`);
}
