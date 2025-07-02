export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  source: string;
  resolved: boolean;
  assigned_to?: string;
  category: 'system' | 'security' | 'performance' | 'maintenance';
} 