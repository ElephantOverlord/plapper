import Game from "../../interfaces/Game";
import Expression from "../Utilities/Expression";

export default class PlayerVsPlayerGame implements Game {
  public type: string;
  public code: string;
  public config: { time: number };
  public expressions: Array<Expression>;

  public constructor(
    code: string,
    config: { time: number },
    expressions: Array<Expression>
  ) {
    this.type = "player-vs-player";
    this.code = code;
    this.config = config;
    this.expressions = expressions;
  }
}
