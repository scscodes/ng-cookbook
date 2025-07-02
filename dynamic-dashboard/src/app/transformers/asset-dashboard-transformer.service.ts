import { DashboardViewModel } from '../models/dashboard-view.model';
import { Asset } from '../models/asset.model';

export class AssetDashboardTransformer {
  static transform(raw: Asset[]): DashboardViewModel[] {
    return raw.map(asset => ({
      id: asset.id,
      title: asset.asset_name,
      primaryValue: `$${asset.value_usd.toLocaleString()}`,
      secondaryValue: asset.status.charAt(0).toUpperCase() + asset.status.slice(1),
      icon: this.getAssetIcon(asset.details.category),
      meta: [
        { label: 'Category', value: asset.details.category },
        { label: 'Description', value: asset.details.description },
        { label: 'Location', value: asset.details.location || 'N/A' }
      ],
      cta: {
        label: 'View Details',
        action: () => alert(`Navigating to asset ${asset.id}`)
      }
    }));
  }

  private static getAssetIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Heavy Equipment': '🚜',
      'Vehicles': '🚗',
      'Tools': '🔧',
      'Electronics': '💻',
      'Furniture': '🪑'
    };
    return icons[category] || '📦';
  }
}
