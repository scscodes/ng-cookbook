export interface Asset {
  id: string;
  asset_name: string;
  value_usd: number;
  details: { 
    description: string; 
    category: string;
    location?: string;
    purchase_date?: string;
  };
  status: 'available' | 'retired' | 'maintenance';
  last_updated: string;
} 