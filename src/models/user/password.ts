interface Counter {
  value: number;
  valueOf: () => number;

  increment(): void;
}

export const ValidationCounter = class implements Counter {
  private _value: number;

  constructor() {
    this._value = 0;
  }

  set value(count: number) {
    this._value = count;
  }

  get valueOf(): () => number {
    return () => this._value;
  }

  increment(): void {
    this._value++;
  }
};

const PasswordValidation = class {
  public static readonly NUMBER = /[0-9]/;
  public static readonly UPPER_CASE = /[A-Z]/;
  public static readonly LOWER_CASE = /[a-z]/;
  public static readonly SPECIAL_CHARACTER =
    /[!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?]/;

  private readonly count: Counter;

  constructor() {
    this.count = new ValidationCounter();
  }

  public pass(): void {
    this.count.increment();
  }

  public fail(): void {
    // pass 함수의 대칭성을 구성하기 위해 정의한 함수 입니다, 비밀번호 유효성 검사 실패 기능을 추가할 경우 작성하세요.
  }

  public isPassed(): boolean {
    return this.count.valueOf() > 1;
  }
};

export default PasswordValidation;
