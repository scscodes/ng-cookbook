export interface DashboardViewModel {
  id: string;
  title: string;
  primaryValue: string | number;
  secondaryValue?: string | number;
  icon?: string;
  meta?: { label: string; value: string }[];
  cta?: {
    label: string;
    action: () => void;
    type?: 'link' | 'button';
  };
}
