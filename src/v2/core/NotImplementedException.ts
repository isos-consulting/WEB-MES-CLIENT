export class NotImplementedException extends Error {
  /**
   * @class NotImplementedException
   * @extends {Error}
   * @description This class is used to throw an exception when a method is not implemented
   * @param {string} message
   * @memberof NotImplementedException
   * @constructor
   * @example
   * throw new NotImplementedException('PartnerTypeService.createPartner()');
   */
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedException';
    this.message = `${message} is not implemented`;
  }
}
