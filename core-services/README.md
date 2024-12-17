# Core Services

`session.service` - bootstrap application. initialize view timers.


`data-broker.service` - consolidated destination for outbound logs. manage and send buffer.


`event-listener.service` - dom, event handling log collection. forward logs to buffer.


`nav-listener.service` - navigation, router log collection. forward logs to buffer.



# Cache Busting with Build Version Increments
> Note! Assumes and increments patch value, given `major.minor.patch` in `package.json`

Environment-based build commands are prefaced by an increment script, updates `package.json` and `environment.ts` version and timestamp fields.
Should a browser cache third-party assets (ex: fontawesome), the change in version # will force a new query.


`increment-version.js` - set version and timestamp for flagged environment.

* Define or update `environment.ts`, and any other environment-specific `environment.<env>.ts`
```typescript
// environment.ts
export const environment = {
  production: false,
  version: '0.0.0',
  buildTimestamp: ''
};

```


* Update `angular.json` build configurations, set file replacements as needed
```json
{
  "development": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.dev.ts"
      }
    ]
  },
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

* Update `package.json` scripts, including environment-specific version and build config
```json
{
  "scripts": {
    "start:dev": "ng serve --configuration development",
    "start:prod": "ng serve --configuration production",
    "build:dev": "node increment-version.js development && ng build --configuration development",
    "build:prod": "node increment-version.js production && ng build --configuration production"
 }
}
```
