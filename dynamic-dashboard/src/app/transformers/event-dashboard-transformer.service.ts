import { DashboardViewModel } from '../models/dashboard-view.model';
import { Event } from '../models/event.model';

export class EventDashboardTransformer {
  static transform(raw: Event[]): DashboardViewModel[] {
    return raw.map(event => {
      const startDate = new Date(event.start_time);
      const isToday = new Date().toDateString() === startDate.toDateString();
      const isUpcoming = startDate > new Date();
      
      return {
        id: event.id,
        title: event.title,
        primaryValue: `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        secondaryValue: isToday ? 'Today' : isUpcoming ? 'Upcoming' : 'Past',
        icon: this.getEventIcon(event.category),
        meta: [
          { label: 'Category', value: event.category.charAt(0).toUpperCase() + event.category.slice(1) },
          { label: 'Attendees', value: event.attendees.toString() },
          { label: 'Priority', value: event.priority.charAt(0).toUpperCase() + event.priority.slice(1) }
        ],
        cta: {
          label: 'View Details',
          action: () => alert(`Opening event: ${event.title}`)
        }
      };
    });
  }

  private static getEventIcon(category: string): string {
    const icons = {
      meeting: '📅',
      workshop: '🎓',
      deadline: '⏰',
      milestone: '🎯'
    };
    return icons[category as keyof typeof icons] || '📅';
  }
} 