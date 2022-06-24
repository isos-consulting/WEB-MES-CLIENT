export interface InspectionChecker {
  check: (...arg: any) => boolean;
}

export interface InspectionConcreate {
  new (): InspectionChecker;
}

export class EmptyInspectionChecker implements InspectionChecker {
  check(arg: any) {
    return null;
  }
}

export class NumberInspectionChecker implements InspectionChecker {
  check(arg: any) {
    return this.innerRange(arg);
  }
  innerRange({ value, min, max }: { value: number; min: number; max: number }) {
    return value >= min && value <= max;
  }
}

export class EyeInspectionChecker implements InspectionChecker {
  check(arg: any) {
    return this.isOK(arg);
  }

  isOK({ value }) {
    return value.toUpperCase() === 'OK';
  }
}
