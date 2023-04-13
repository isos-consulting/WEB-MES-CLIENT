type ConfirmProps = {
  icon?: string;
  title: string;
  content: string;
  onOk: () => void;
  onCancel: () => void;
  okText: string;
  cancelText: string;
};

type DialogUtilConfrimProps = {
  title: string;
  message: string;
  onOk: () => void;
};

export type Dialog = {
  confirm: (props: ConfirmProps) => void;
};

export class DialogUtil {
  private constructor(private dialog: Dialog) {}

  public static valueOf(dialog: Dialog) {
    return new DialogUtil(dialog);
  }

  confirm({ title, message, onOk }: DialogUtilConfrimProps) {
    this.dialog.confirm({
      icon: null,
      title: title,
      content: message,
      onOk: () => {
        onOk();
      },
      onCancel: () => {},
      okText: '예',
      cancelText: '아니오',
    });
  }
}
