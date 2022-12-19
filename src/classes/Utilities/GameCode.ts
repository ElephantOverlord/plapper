export default class GameCode {
  static generate(): string {
    const characters = "ABCDEFGHJKLMNPQRTUVXY23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}
