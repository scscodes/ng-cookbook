import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../components/dashboard-layout/dashboard-layout.component';
import { AlertDashboardTransformer } from '../../transformers/alert-dashboard-transformer.service';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-alert-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <div class="dashboard-header">
      <h1>System Alerts Dashboard</h1>
      <p>Monitor and manage system alerts and notifications</p>
      <!-- 
        USE CASE: System Alerts - Full-width 1-column layout
        Key Consideration: Critical alerts need immediate attention and full context.
        Users often want to see alert details, timestamps, and actions without distraction.
        Default: 1 column ensures alerts get full attention and reduces cognitive load.
      -->
    </div>
    <app-dashboard-layout 
      [items]="items"
      [config]="{ 
        columns: 1, 
        gap: '16px',
        allowUserCustomization: true,
        maxWidth: '100%',
        padding: '16px' 
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
export class AlertDashboardComponent {
  items = AlertDashboardTransformer.transform(this.getAlertData());

  private getAlertData(): Alert[] {
    return [
      {
        id: 'alert-1',
        title: 'Database Connection Timeout',
        message: 'Primary database connection failed after 30 seconds',
        severity: 'critical',
        timestamp: '2024-01-15T14:30:00Z',
        source: 'Database Server',
        resolved: false,
        assigned_to: 'DBA Team',
        category: 'system'
      },
      {
        id: 'alert-2',
        title: 'High CPU Usage Detected',
        message: 'CPU usage exceeded 90% threshold on web server',
        severity: 'warning',
        timestamp: '2024-01-15T13:45:00Z',
        source: 'Web Server 01',
        resolved: false,
        assigned_to: 'DevOps Team',
        category: 'performance'
      },
      {
        id: 'alert-3',
        title: 'SSL Certificate Expiring',
        message: 'SSL certificate will expire in 7 days',
        severity: 'warning',
        timestamp: '2024-01-15T12:15:00Z',
        source: 'Load Balancer',
        resolved: false,
        assigned_to: 'Security Team',
        category: 'security'
      },
      {
        id: 'alert-4',
        title: 'Backup Job Completed',
        message: 'Daily backup completed successfully',
        severity: 'info',
        timestamp: '2024-01-15T06:00:00Z',
        source: 'Backup System',
        resolved: true,
        assigned_to: 'System Admin',
        category: 'maintenance'
      },
      {
        id: 'alert-5',
        title: 'Memory Leak Detected',
        message: 'Application memory usage growing abnormally',
        severity: 'error',
        timestamp: '2024-01-15T10:20:00Z',
        source: 'Application Server',
        resolved: false,
        assigned_to: 'Development Team',
        category: 'performance'
      },
      {
        id: 'alert-6',
        title: 'Scheduled Maintenance',
        message: 'Planned maintenance window starting in 2 hours',
        severity: 'info',
        timestamp: '2024-01-15T08:00:00Z',
        source: 'System Scheduler',
        resolved: true,
        assigned_to: 'Operations Team',
        category: 'maintenance'
      }
    ];
  }
} 