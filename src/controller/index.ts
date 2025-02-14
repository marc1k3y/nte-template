export class MasterController {
  controller: string;

  constructor(controller: string) {
    this.controller = controller;
  }

  public newError(code: number, method: string, message: string) {
    throw new Error(`${code}:[${this.controller}.${method}]${message}`);
  }
}