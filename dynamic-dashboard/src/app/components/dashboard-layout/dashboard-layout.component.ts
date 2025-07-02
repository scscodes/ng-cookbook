import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { DashboardViewModel } from '../../models/dashboard-view.model';
import { UserLayoutService } from '../../services/user-layout.service';

export interface DashboardLayoutConfig {
  columns?: number;
  gap?: string;
  maxWidth?: string;
  padding?: string;
  allowUserCustomization?: boolean;
}

interface LayoutPreset {
  id: string;
  name: string;
  config: DashboardLayoutConfig;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  @Input() items: DashboardViewModel[] = [];
  @Input() config: DashboardLayoutConfig = {
    columns: 3,
    gap: '20px',
    maxWidth: '1200px',
    padding: '20px',
    allowUserCustomization: true
  };

  currentPreset = 'standard';
  
  layoutPresets: LayoutPreset[] = [
    {
      id: 'compact',
      name: 'Compact',
      config: { columns: 4, gap: '12px', maxWidth: '1400px', padding: '16px' }
    },
    {
      id: 'standard',
      name: 'Standard',
      config: { columns: 3, gap: '20px', maxWidth: '1200px', padding: '20px' }
    },
    {
      id: 'wide',
      name: 'Wide',
      config: { columns: 2, gap: '24px', maxWidth: '1000px', padding: '24px' }
    },
    {
      id: 'full',
      name: 'Full Width',
      config: { columns: 1, gap: '16px', maxWidth: '100%', padding: '16px' }
    }
  ];

  constructor(private userLayoutService: UserLayoutService) {}

  ngOnInit(): void {
    // Load user preferences on component init
    this.userLayoutService.loadFromStorage();
    
    // Subscribe to user preference changes
    this.userLayoutService.preferences.subscribe(prefs => {
      if (prefs.allowUserCustomization) {
        this.config = { ...this.config, ...prefs };
      }
    });
  }

  get gridStyle(): { [key: string]: string } {
    return {
      'grid-template-columns': `repeat(${this.config.columns}, 1fr)`,
      'gap': this.config.gap || '20px',
      'max-width': this.config.maxWidth || '1200px',
      'padding': this.config.padding || '20px'
    };
  }

  onColumnChange(columns: number): void {
    this.config.columns = columns;
    this.userLayoutService.updateLayout({ columns });
  }

  onPresetChange(preset: LayoutPreset): void {
    this.currentPreset = preset.id;
    this.config = { ...this.config, ...preset.config };
    this.userLayoutService.updateLayout(preset.config);
  }
}
