export interface Props {
  id?: string;
  value?: number | string | boolean;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export interface EventChange {
  isChecked: boolean;
  value: number | string | boolean;
}
