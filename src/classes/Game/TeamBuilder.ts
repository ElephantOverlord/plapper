import Player from "./Player";

export default class TeamBuilder {
  public static fifo(players: Array<Player>): {
    red: Array<Player>;
    blue: Array<Player>;
  } {
    const red = [];
    const blue = [];
    for (let i = 0; i < players.length; i++) {
      if (i % 2 === 0) {
        red.push(players[i]);
      } else {
        blue.push(players[i]);
      }
    }
    return {
      red,
      blue,
    };
  }
}
