export interface ContactType {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface ContactColor {
  label: string;
  value: string;
}
