# NG Dashboard Showcase

A modern Angular 20+ dashboard showcase using standalone components, transformer pattern, and best practices. This project demonstrates a scalable, maintainable approach for building dashboards with different data domains.

## Features
- **Angular 20+** with standalone components (no NgModules)
- **Transformer pattern**: decouples raw data from UI view models
- **Reusable dashboard layout and card components**
- **Dynamic layout customization**: 1-6 columns, presets, user preferences
- **Responsive design**: automatic mobile/tablet/desktop adaptation
- **Multiple dashboard types**: asset management, performance metrics, resource management, and system alerts
- **Clean, modular, and extensible architecture**

## Dashboards

### 1. Asset Management Dashboard
- **Showcases:** Equipment, vehicles, tools, and electronics
- **Purpose:** Track and manage physical assets, their status, and key details
- **Sample data:** Tractors, excavators, cranes, forklifts, laptops, etc.
- **Layout:** Standard 3-column layout (balanced information density)

### 2. Performance Metrics Dashboard
- **Showcases:** Key performance indicators (KPIs) and business metrics
- **Purpose:** Monitor business health, trends, and targets
- **Sample data:** Revenue, customer satisfaction, system uptime, active users, conversion rate, average order value
- **Layout:** Compact 4-column layout (maximizes metric visibility)

### 3. Resource Management Dashboard
- **Showcases:** Infrastructure resources and their utilization
- **Purpose:** Monitor servers, databases, storage, networks, and services
- **Sample data:** Production databases, web servers, file storage, load balancers, API gateways, analytics databases
- **Layout:** Wide 2-column layout (detailed resource information)

### 4. System Alerts Dashboard
- **Showcases:** System notifications, warnings, and errors
- **Purpose:** Monitor and manage critical system events and operational alerts
- **Sample data:** Database timeouts, high CPU usage, SSL expiry, backup jobs, memory leaks, scheduled maintenance
- **Layout:** Full-width 1-column layout (critical alert focus)

## Quick Start
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm start
   ```
3. Open [http://localhost:4200](http://localhost:4200) in your browser.

## Structure
- `src/app/models/` — Raw data models for each domain
- `src/app/transformers/` — Transformers to convert raw data to dashboard view models
- `src/app/components/` — Reusable layout, card, and navigation components
- `src/app/features/` — Feature components for each dashboard type

## Layout Customization
Each dashboard includes layout controls that allow users to:
- **Adjust columns:** 1-6 columns for different viewing preferences
- **Choose presets:** Compact, Standard, Wide, or Full-width layouts
- **Save preferences:** User choices are remembered across sessions
- **Responsive design:** Automatically adapts to mobile and tablet screens

## Extending
To add a new dashboard:
1. Create a new model and transformer.
2. Add a new feature component with appropriate layout configuration.
3. Register it in the navigation.

---
Built with Angular 20+ best practices for modern, maintainable dashboards.

# Key Concepts in This Structure
✅ Models

    dashboard-view.model.ts: what the UI renders

    *.model.ts: each source's raw shape

✅ Transformers

    One per source

    Fully testable

    Converts source-specific models → DashboardViewModel

✅ Components

    Shared dashboard-layout and dashboard-card use only DashboardViewModel

    No component cares about where the data came from

✅ Feature Modules or Pages

    Each dashboard page (asset-dashboard, etc.) pulls its own raw data, uses its transformer, and passes clean view models into the layout

🧪 Testing Benefits

    Each transformer = unit tested with raw input fixtures

    Each layout/card = tested using strictly typed mock view models

    High modularity makes dashboards composable, maintainable, and swappable

# Structure

dashboard-sample/
├── src/
│   └── app/
│
│       ├── app.component.ts
│       ├── app.module.ts
│
│       ├── models/
│       │   ├── dashboard-view.model.ts            # Shared render contract
│       │   ├── asset.model.ts
│       │   ├── resource.model.ts
│       │   ├── event.model.ts
│       │   ├── alert.model.ts
│       │   └── person.model.ts
│
│       ├── transformers/
│       │   ├── dashboard-transformer.interface.ts # Optional shared interface
│       │   ├── asset-dashboard-transformer.service.ts
│       │   ├── resource-dashboard-transformer.service.ts
│       │   ├── event-dashboard-transformer.service.ts
│       │   ├── alert-dashboard-transformer.service.ts
│       │   └── person-dashboard-transformer.service.ts
│
│       ├── services/
│       │   ├── asset.service.ts
│       │   ├── resource.service.ts
│       │   └── ...                                # fetch and format raw data
│
│       ├── components/
│       │   ├── dashboard-layout/
│       │   │   ├── dashboard-layout.component.ts
│       │   │   └── dashboard-layout.component.html
│       │   │
│       │   └── dashboard-card/
│       │       ├── dashboard-card.component.ts
│       │       ├── dashboard-card.component.html
│       │       └── dashboard-card.component.scss
│
│       ├── features/
│       │   ├── asset-dashboard/
│       │   │   ├── asset-dashboard.component.ts
│       │   │   └── asset-dashboard.component.html
│       │   │
│       │   ├── resource-dashboard/
│       │   │   ├── resource-dashboard.component.ts
│       │   │   └── resource-dashboard.component.html
│       │   │

