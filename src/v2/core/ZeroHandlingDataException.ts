export class ZeroHandlingDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZeroHandlingDataException';
  }
}
