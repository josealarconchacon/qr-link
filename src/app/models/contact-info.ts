export interface ContactInfo {
  type: string;
  value: string;
  customType?: string;
  customIcon?: string;
  customColor?: string;
}

export interface ContactType {
  id: string;
  label: string;
  icon: string;
  color: string;
  isCustom?: boolean;
}
