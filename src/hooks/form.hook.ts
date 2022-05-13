import { atom, AtomOptions, RecoilState, SetterOrUpdater } from 'recoil';

export class FormStore<T = undefined> {
  private state: RecoilState<T>;

  constructor(props: AtomOptions<T>) {
    this.state = atom<T>(props);
  }

  get findState() {
    return this.state;
  }

  onUpdate(setFormState: SetterOrUpdater<T>, option: Partial<T>) {
    setFormState(prevState => ({ ...prevState, ...option }));
  }
}
