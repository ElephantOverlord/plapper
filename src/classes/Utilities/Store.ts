import Game from "../../interfaces/Game";
import Player from "../Game/Player";

export default class Store {
  static storeGameTeacher(game: Game): void {
    this.storeObject("game-teacher", game);
  }

  static loadGameTeacher(): Game {
    return this.loadObject("game-teacher") as Game;
  }

  static storeGameStudent(game: Game): void {
    this.storeObject("game-student", game);
  }

  static loadGameStudent(): Game {
    return this.loadObject("game-student") as Game;
  }

  static storePlayerStudent(player: Player): void {
    this.storeObject("player-student", player);
  }

  static loadPlayerStudent(): Player {
    return this.loadObject("player-student") as Player;
  }

  static clearStorage(): void {
    sessionStorage.clear();
  }

  private static storeObject(key: string, object: object): void {
    sessionStorage.setItem(key, JSON.stringify(object));
  }

  private static loadObject(key: string): object {
    const object = JSON.parse(sessionStorage.getItem(key) as string);
    if (!object) {
      window.location.replace("/");
    }
    return object;
  }
}
