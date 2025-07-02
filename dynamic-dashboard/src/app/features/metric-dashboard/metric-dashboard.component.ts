import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../components/dashboard-layout/dashboard-layout.component';
import { MetricDashboardTransformer } from '../../transformers/metric-dashboard-transformer.service';
import { Metric } from '../../models/metric.model';

@Component({
  selector: 'app-metric-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <div class="dashboard-header">
      <h1>Performance Metrics Dashboard</h1>
      <p>Monitor key performance indicators and business metrics</p>
      <!-- 
        USE CASE: Performance Metrics - Compact 4-column layout
        Key Consideration: KPIs are often glanced at quickly and compared side-by-side.
        Users typically want to see many metrics at once for quick scanning.
        Default: 4 columns maximizes metric visibility for executive dashboards.
      -->
    </div>
    <app-dashboard-layout 
      [items]="items"
      [config]="{ 
        columns: 4, 
        gap: '16px',
        allowUserCustomization: true,
        maxWidth: '1400px' 
      }">
    </app-dashboard-layout>
  `,
  styles: [`
    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }
    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    .dashboard-header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }
  `]
})
export class MetricDashboardComponent {
  items = MetricDashboardTransformer.transform(this.getMetricData());

  private getMetricData(): Metric[] {
    return [
      {
        id: 'metric-1',
        name: 'Monthly Revenue',
        current_value: 1250000,
        previous_value: 1180000,
        target_value: 1300000,
        unit: 'USD',
        trend: 'up',
        change_percentage: 5.93,
        category: 'financial',
        last_updated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'metric-2',
        name: 'Customer Satisfaction',
        current_value: 4.7,
        previous_value: 4.5,
        target_value: 4.8,
        unit: '/5.0',
        trend: 'up',
        change_percentage: 4.44,
        category: 'quality',
        last_updated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'metric-3',
        name: 'System Uptime',
        current_value: 99.2,
        previous_value: 99.5,
        target_value: 99.9,
        unit: '%',
        trend: 'down',
        change_percentage: -0.30,
        category: 'performance',
        last_updated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'metric-4',
        name: 'Active Users',
        current_value: 15420,
        previous_value: 14800,
        target_value: 16000,
        unit: 'users',
        trend: 'up',
        change_percentage: 4.19,
        category: 'performance',
        last_updated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'metric-5',
        name: 'Conversion Rate',
        current_value: 3.2,
        previous_value: 3.4,
        target_value: 3.5,
        unit: '%',
        trend: 'down',
        change_percentage: -5.88,
        category: 'sales',
        last_updated: '2024-01-15T00:00:00Z'
      },
      {
        id: 'metric-6',
        name: 'Average Order Value',
        current_value: 85.50,
        previous_value: 85.50,
        target_value: 90.00,
        unit: 'USD',
        trend: 'stable',
        change_percentage: 0.00,
        category: 'sales',
        last_updated: '2024-01-15T00:00:00Z'
      }
    ];
  }
} 