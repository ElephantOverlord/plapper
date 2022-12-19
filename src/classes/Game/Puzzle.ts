export default class Puzzle {
  public question: string;
  public solution: string;
  public answers: Array<String>;
  public id: string;

  public constructor(
    question: string,
    solution: string,
    answers: Array<string>
  ) {
    this.id = Math.floor(Math.random() * 1000000) + "_" + Date.now();
    this.question = question;
    this.solution = solution;
    this.answers = answers;
  }
}
