import { DashboardViewModel } from '../models/dashboard-view.model';
import { Alert } from '../models/alert.model';

export class AlertDashboardTransformer {
  static transform(raw: Alert[]): DashboardViewModel[] {
    return raw.map(alert => {
      const timestamp = new Date(alert.timestamp);
      const timeAgo = this.getTimeAgo(timestamp);
      
      return {
        id: alert.id,
        title: alert.title,
        primaryValue: alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1),
        secondaryValue: timeAgo,
        icon: this.getAlertIcon(alert.severity),
        meta: [
          { label: 'Source', value: alert.source },
          { label: 'Category', value: alert.category.charAt(0).toUpperCase() + alert.category.slice(1) },
          { label: 'Status', value: alert.resolved ? 'Resolved' : 'Active' }
        ],
        cta: {
          label: alert.resolved ? 'View Details' : 'Resolve',
          action: () => window.alert(`Handling alert: ${alert.title}`)
        }
      };
    });
  }

  private static getAlertIcon(severity: string): string {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🚨'
    };
    return icons[severity as keyof typeof icons] || 'ℹ️';
  }

  private static getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
} 