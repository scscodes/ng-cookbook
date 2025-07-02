import { DashboardViewModel } from '../models/dashboard-view.model';
import { Resource } from '../models/resource.model';

export class ResourceDashboardTransformer {
  static transform(raw: Resource[]): DashboardViewModel[] {
    return raw.map(resource => {
      const usagePercentage = Math.round((resource.used / resource.capacity) * 100);
      const usageColor = usagePercentage > 90 ? 'critical' : usagePercentage > 70 ? 'warning' : 'normal';
      
      return {
        id: resource.id,
        title: resource.name,
        primaryValue: `${resource.used.toLocaleString()} / ${resource.capacity.toLocaleString()} ${resource.unit}`,
        secondaryValue: `${usagePercentage}% used`,
        icon: this.getResourceIcon(resource.type),
        meta: [
          { label: 'Type', value: resource.type.charAt(0).toUpperCase() + resource.type.slice(1) },
          { label: 'Status', value: resource.status.charAt(0).toUpperCase() + resource.status.slice(1) },
          { label: 'Location', value: resource.location }
        ],
        cta: {
          label: 'View Details',
          action: () => alert(`Opening resource details for ${resource.name}`)
        }
      };
    });
  }

  private static getResourceIcon(type: string): string {
    const icons = {
      server: '🖥️',
      database: '🗄️',
      storage: '💾',
      network: '🌐',
      service: '⚙️'
    };
    return icons[type as keyof typeof icons] || '📦';
  }
}
