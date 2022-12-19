import Expression from "../classes/Utilities/Expression";

export default interface Game {
  type: string;
  code: string;
  config: object;
  expressions: Array<Expression>;
}
