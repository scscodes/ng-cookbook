import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../components/dashboard-layout/dashboard-layout.component';
import { AssetDashboardTransformer } from '../../transformers/asset-dashboard-transformer.service';
import { Asset } from '../../models/asset.model';

@Component({
  selector: 'app-asset-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: `
    <div class="dashboard-header">
      <h1>Asset Management Dashboard</h1>
      <p>Track and manage your equipment and assets</p>
      <!-- 
        USE CASE: Asset Management - Standard 3-column layout
        Key Consideration: Assets have varying importance and detail levels.
        Users may want to see more assets at once (compact) or focus on fewer with more detail (wide).
        Default: 3 columns balances information density with readability.
      -->
    </div>
    <app-dashboard-layout 
      [items]="items"
      [config]="{ 
        columns: 3, 
        allowUserCustomization: true,
        maxWidth: '1200px' 
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
export class AssetDashboardComponent {
  items = AssetDashboardTransformer.transform(this.getAssetData());

  private getAssetData(): Asset[] {
    return [
      {
        id: 'asset-1',
        asset_name: 'Tractor A1',
        value_usd: 120000,
        details: { 
          description: 'Heavy duty hauling tractor', 
          category: 'Heavy Equipment',
          location: 'Warehouse A',
          purchase_date: '2023-01-15'
        },
        status: 'available',
        last_updated: '2024-01-15T10:30:00Z'
      },
      {
        id: 'asset-2',
        asset_name: 'Excavator B2',
        value_usd: 85000,
        details: { 
          description: 'Mini excavator for tight spaces', 
          category: 'Heavy Equipment',
          location: 'Construction Site B',
          purchase_date: '2023-03-20'
        },
        status: 'available',
        last_updated: '2024-01-14T15:45:00Z'
      },
      {
        id: 'asset-3',
        asset_name: 'Crane C3',
        value_usd: 150000,
        details: { 
          description: 'Mobile crane for lifting operations', 
          category: 'Heavy Equipment',
          location: 'Project Site C',
          purchase_date: '2022-11-10'
        },
        status: 'maintenance',
        last_updated: '2024-01-13T09:15:00Z'
      },
      {
        id: 'asset-4',
        asset_name: 'Forklift D4',
        value_usd: 45000,
        details: { 
          description: 'Electric forklift for warehouse operations', 
          category: 'Vehicles',
          location: 'Warehouse A',
          purchase_date: '2023-06-05'
        },
        status: 'available',
        last_updated: '2024-01-15T08:20:00Z'
      },
      {
        id: 'asset-5',
        asset_name: 'Drill Press E5',
        value_usd: 2500,
        details: { 
          description: 'Industrial drill press for metal work', 
          category: 'Tools',
          location: 'Machine Shop',
          purchase_date: '2023-08-12'
        },
        status: 'available',
        last_updated: '2024-01-14T14:30:00Z'
      },
      {
        id: 'asset-6',
        asset_name: 'Laptop F6',
        value_usd: 1200,
        details: { 
          description: 'Engineering workstation laptop', 
          category: 'Electronics',
          location: 'Office Building',
          purchase_date: '2023-09-01'
        },
        status: 'retired',
        last_updated: '2024-01-10T16:00:00Z'
      }
    ];
  }
} 