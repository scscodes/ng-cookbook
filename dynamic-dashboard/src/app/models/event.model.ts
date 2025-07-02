export interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendees: number;
  category: 'meeting' | 'workshop' | 'deadline' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
} 