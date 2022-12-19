import shuffle from "lodash/shuffle";
import Expression from "../Utilities/Expression";
import Puzzle from "./Puzzle";

export default class PuzzleGenerator {
  private expressions: Array<Expression>;
  private previousQuestionIndex: number;

  public constructor(expressions: Array<Expression>) {
    this.expressions = expressions;
    this.previousQuestionIndex = -1;
    this.generate();
  }

  public generate(): Puzzle {
    const indices = [] as Array<number>;
    while (indices.length < 4) {
      const index = Math.floor(Math.random() * this.expressions.length);
      if (!indices.includes(index) && index !== this.previousQuestionIndex) {
        indices.push(index);
      }
    }
    this.previousQuestionIndex = indices[0];
    const questionInForeignLanguage = Math.random() < 0.5;
    const question = questionInForeignLanguage
      ? this.expressions[indices[0]].foreign
      : this.expressions[indices[0]].native;
    const solution = questionInForeignLanguage
      ? this.expressions[indices[0]].native
      : this.expressions[indices[0]].foreign;
    const answers = shuffle([
      questionInForeignLanguage
        ? this.expressions[indices[0]].native
        : this.expressions[indices[0]].foreign,
      questionInForeignLanguage
        ? this.expressions[indices[1]].native
        : this.expressions[indices[1]].foreign,
      questionInForeignLanguage
        ? this.expressions[indices[2]].native
        : this.expressions[indices[2]].foreign,
      questionInForeignLanguage
        ? this.expressions[indices[3]].native
        : this.expressions[indices[3]].foreign,
    ]);
    return new Puzzle(question, solution, answers);
  }
}
