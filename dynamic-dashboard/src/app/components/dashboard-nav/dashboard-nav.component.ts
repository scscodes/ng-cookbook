import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="dashboard-nav">
      <div class="nav-container">
        <h2 class="nav-title">Dashboard Showcase</h2>
        <div class="nav-grid">
          <button 
            *ngFor="let type of dashboardTypes" 
            class="nav-item"
            [class.active]="selectedType === type.id"
            (click)="selectDashboard(type.id)"
          >
            <span class="nav-icon">{{ type.icon }}</span>
            <div class="nav-content">
              <h3>{{ type.name }}</h3>
              <p>{{ type.description }}</p>
            </div>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .dashboard-nav {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .nav-title {
      text-align: center;
      color: white;
      font-size: 2rem;
      margin-bottom: 2rem;
      font-weight: 600;
    }
    
    .nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .nav-item {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .nav-item:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .nav-item.active {
      background: white;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .nav-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .nav-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2d3748;
    }
    
    .nav-content p {
      margin: 0;
      font-size: 0.9rem;
      color: #718096;
      line-height: 1.4;
    }
  `]
})
export class DashboardNavComponent {
  @Output() dashboardSelected = new EventEmitter<string>();
  
  selectedType = 'assets';
  
  dashboardTypes: DashboardType[] = [
    {
      id: 'assets',
      name: 'Asset Management',
      description: 'Track equipment, vehicles, and physical assets',
      icon: '🚜'
    },
    {
      id: 'metrics',
      name: 'Performance Metrics',
      description: 'Monitor KPIs and business performance indicators',
      icon: '📊'
    },
    {
      id: 'resources',
      name: 'Resource Management',
      description: 'Monitor infrastructure resources and utilization',
      icon: '🖥️'
    },
    {
      id: 'alerts',
      name: 'System Alerts',
      description: 'Manage system notifications and alerts',
      icon: '🚨'
    }
  ];

  selectDashboard(typeId: string) {
    this.selectedType = typeId;
    this.dashboardSelected.emit(typeId);
  }
} 