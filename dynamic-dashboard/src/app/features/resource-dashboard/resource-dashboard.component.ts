import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../components/dashboard-layout/dashboard-layout.component';
import { ResourceDashboardTransformer } from '../../transformers/resource-dashboard-transformer.service';
import { Resource } from '../../models/resource.model';

@Component({
  selector: 'app-resource-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <div class="dashboard-header">
      <h1>Resource Management Dashboard</h1>
      <p>Monitor infrastructure resources and their utilization</p>
      <!-- 
        USE CASE: Resource Management - Wide 2-column layout
        Key Consideration: Infrastructure resources have detailed technical information.
        Users need to see capacity, usage percentages, and status clearly.
        Default: 2 columns provides space for detailed resource information and charts.
      -->
    </div>
    <app-dashboard-layout 
      [items]="items"
      [config]="{ 
        columns: 2, 
        gap: '24px',
        allowUserCustomization: true,
        maxWidth: '1000px' 
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
export class ResourceDashboardComponent {
  items = ResourceDashboardTransformer.transform(this.getResourceData());

  private getResourceData(): Resource[] {
    return [
      {
        id: 'resource-1',
        name: 'Production Database',
        type: 'database',
        status: 'online',
        capacity: 1000,
        used: 750,
        unit: 'GB',
        location: 'US East',
        last_updated: '2024-01-15T14:30:00Z',
        owner: 'DBA Team',
        tags: ['production', 'critical']
      },
      {
        id: 'resource-2',
        name: 'Web Server Cluster',
        type: 'server',
        status: 'online',
        capacity: 16,
        used: 12,
        unit: 'cores',
        location: 'US West',
        last_updated: '2024-01-15T14:25:00Z',
        owner: 'DevOps Team',
        tags: ['web', 'load-balanced']
      },
      {
        id: 'resource-3',
        name: 'File Storage System',
        type: 'storage',
        status: 'degraded',
        capacity: 5000,
        used: 4800,
        unit: 'GB',
        location: 'US Central',
        last_updated: '2024-01-15T14:20:00Z',
        owner: 'Storage Team',
        tags: ['backup', 'archive']
      },
      {
        id: 'resource-4',
        name: 'Load Balancer',
        type: 'network',
        status: 'online',
        capacity: 1000,
        used: 450,
        unit: 'connections',
        location: 'US East',
        last_updated: '2024-01-15T14:15:00Z',
        owner: 'Network Team',
        tags: ['high-availability']
      },
      {
        id: 'resource-5',
        name: 'API Gateway',
        type: 'service',
        status: 'maintenance',
        capacity: 500,
        used: 0,
        unit: 'connections',
        location: 'US West',
        last_updated: '2024-01-15T14:10:00Z',
        owner: 'Platform Team',
        tags: ['api', 'gateway']
      },
      {
        id: 'resource-6',
        name: 'Analytics Database',
        type: 'database',
        status: 'online',
        capacity: 2000,
        used: 1200,
        unit: 'GB',
        location: 'US Central',
        last_updated: '2024-01-15T14:05:00Z',
        owner: 'Data Team',
        tags: ['analytics', 'warehouse']
      }
    ];
  }
}
