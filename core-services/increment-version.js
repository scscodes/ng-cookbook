const fs = require('fs');
const path = require('path');

// Capture build config from process args
// e.g. "node increment-version.js dev" or "node increment-version.js production"
const buildConfig = process.argv[2] || 'development';
// We can map the config to the environment file
const envFile = buildConfig === 'production'
  ? 'environment.prod.ts'
  : 'environment.dev.ts';

// Paths
const envFilePath = path.join(__dirname, 'src/environments', envFile);
const packageJsonPath = path.join(__dirname, 'package.json');

// 1. Read current version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// 2. Increment patch version only for the specified config
patch++;
const newVersion = `${major}.${minor}.${patch}`;

// 3. Build timestamp
const buildTimestamp = new Date().toISOString();

// 4. Update package.json if desired (optional).
// Some workflows might prefer not to unify these versions.
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

// 5. Update the environment.dev.ts or environment.prod.ts only
let envContent = fs.readFileSync(envFilePath, 'utf-8');
envContent = envContent.replace(
  /version:\s*'[^']*'/,
  `version: '${newVersion}'`
);
envContent = envContent.replace(
  /buildTimestamp:\s*'[^']*'/,
  `buildTimestamp: '${buildTimestamp}'`
);
fs.writeFileSync(envFilePath, envContent, 'utf-8');

console.log(`\n[${buildConfig.toUpperCase()} BUILD] Updated ${envFile} to version=${newVersion}, timestamp=${buildTimestamp}`);
