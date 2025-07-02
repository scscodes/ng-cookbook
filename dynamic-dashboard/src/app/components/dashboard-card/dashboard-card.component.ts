import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewModel } from '../../models/dashboard-view.model';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() item!: DashboardViewModel;
}
