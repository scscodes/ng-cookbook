import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardNavComponent } from './components/dashboard-nav/dashboard-nav.component';
import { AssetDashboardComponent } from './features/asset-dashboard/asset-dashboard.component';
import { MetricDashboardComponent } from './features/metric-dashboard/metric-dashboard.component';
import { ResourceDashboardComponent } from './features/resource-dashboard/resource-dashboard.component';
import { AlertDashboardComponent } from './features/alert-dashboard/alert-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardNavComponent,
    AssetDashboardComponent,
    MetricDashboardComponent,
    ResourceDashboardComponent,
    AlertDashboardComponent
  ],
  template: `
    <div class="app-container">
      <app-dashboard-nav (dashboardSelected)="onDashboardSelected($event)"></app-dashboard-nav>
      
      <div class="dashboard-content">
        <app-asset-dashboard *ngIf="selectedDashboard === 'assets'"></app-asset-dashboard>
        <app-metric-dashboard *ngIf="selectedDashboard === 'metrics'"></app-metric-dashboard>
        <app-resource-dashboard *ngIf="selectedDashboard === 'resources'"></app-resource-dashboard>
        <app-alert-dashboard *ngIf="selectedDashboard === 'alerts'"></app-alert-dashboard>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      padding: 20px;
    }
    
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  selectedDashboard = 'assets';

  onDashboardSelected(dashboardType: string) {
    this.selectedDashboard = dashboardType;
  }
}
