export class RequiredFieldException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequiredFieldException';
  }
}
