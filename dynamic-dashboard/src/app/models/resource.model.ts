export interface Resource {
  id: string;
  name: string;
  type: 'server' | 'database' | 'storage' | 'network' | 'service';
  status: 'online' | 'offline' | 'maintenance' | 'degraded';
  capacity: number;
  used: number;
  unit: 'GB' | 'TB' | 'MB' | 'cores' | 'connections';
  location: string;
  last_updated: string;
  owner?: string;
  tags?: string[];
}
