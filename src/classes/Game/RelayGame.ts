import Game from "../../interfaces/Game";
import Expression from "../Utilities/Expression";

export default class RelayGame implements Game {
  public type: string;
  public code: string;
  public config: { penalty: number };
  public expressions: Array<Expression>;

  public constructor(
    code: string,
    config: { penalty: number },
    expressions: Array<Expression>
  ) {
    this.type = "relay";
    this.code = code;
    this.config = config;
    this.expressions = expressions;
  }
}
