import { DashboardViewModel } from '../models/dashboard-view.model';
import { Metric } from '../models/metric.model';

export class MetricDashboardTransformer {
  static transform(raw: Metric[]): DashboardViewModel[] {
    return raw.map(metric => {
      const trendIcon = this.getTrendIcon(metric.trend);
      const changeColor = metric.change_percentage > 0 ? 'positive' : metric.change_percentage < 0 ? 'negative' : 'neutral';
      
      return {
        id: metric.id,
        title: metric.name,
        primaryValue: `${metric.current_value.toLocaleString()} ${metric.unit}`,
        secondaryValue: `${metric.change_percentage > 0 ? '+' : ''}${metric.change_percentage.toFixed(1)}%`,
        icon: trendIcon,
        meta: [
          { label: 'Previous', value: `${metric.previous_value.toLocaleString()} ${metric.unit}` },
          { label: 'Category', value: metric.category.charAt(0).toUpperCase() + metric.category.slice(1) },
          { label: 'Trend', value: metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1) }
        ],
        cta: {
          label: 'View Trend',
          action: () => alert(`Showing trend for ${metric.name}`)
        }
      };
    });
  }

  private static getTrendIcon(trend: string): string {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };
    return icons[trend as keyof typeof icons] || '📊';
  }
} 