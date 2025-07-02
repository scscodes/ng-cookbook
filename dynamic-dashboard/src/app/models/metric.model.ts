export interface Metric {
  id: string;
  name: string;
  current_value: number;
  previous_value: number;
  target_value?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change_percentage: number;
  category: 'sales' | 'performance' | 'quality' | 'financial';
  last_updated: string;
} 