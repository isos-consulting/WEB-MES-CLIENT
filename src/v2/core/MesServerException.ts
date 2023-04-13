export class MesServerException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MesServerException';
  }
}
