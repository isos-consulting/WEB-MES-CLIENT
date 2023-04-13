export class ZeroCreateDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZeroCreateDataException';
    this.message = `${message} is empty`;
  }
}
