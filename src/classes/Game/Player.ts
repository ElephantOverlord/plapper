export default class {
  public id: string;
  public name: string;
  public score: number;

  public constructor(name: string) {
    this.id = Math.floor(Math.random() * 1000000) + "_" + Date.now();
    this.name = name;
    this.score = 0;
  }
}
