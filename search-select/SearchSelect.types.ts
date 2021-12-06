export type TOption = {
  value: string;
  label: string;
};

export interface ISearchSelectProps {
  selectOptions: TOption[];
  isOpen?: boolean;
  className?: string;
}
