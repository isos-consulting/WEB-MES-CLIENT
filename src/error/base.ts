export class ErrorBase {
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }

  generate() {
    throw new Error(this.message);
  }
}
