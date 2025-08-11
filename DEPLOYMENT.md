# Notes App Deployment Guide

## 🚀 Automatic Deployment

This project is configured for automatic deployment to the `/notes/` directory on your FTP server whenever you push to the main branch.

## 🔧 Required GitHub Secrets

You need to configure these secrets in your GitHub repository settings:

### FTP Configuration
- `FTP_SERVER` - Your FTP server hostname
- `FTP_USERNAME` - Your FTP username  
- `FTP_PASSWORD` - Your FTP password

### How to Add Secrets:
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names above

## 📦 Deployment Process

### Automatic Deployment
- **Trigger**: Push to `main` or `master` branch
- **Destination**: `/notes/` directory on your FTP server
- **Build**: Runs `npm run build` to create optimized production bundle
- **Deploy**: Uploads `dist/` folder contents to server

### Manual Deployment
If you need to deploy manually:

```bash
# Build the project
npm run build

# Upload the dist/ folder to your server's /notes/ directory
```

## 🔄 Dependency Management

### Renovate Bot
- **Auto-updates**: Dependencies are automatically updated every Monday
- **Auto-merge**: Minor and patch updates are automatically merged
- **Security**: Critical security updates are prioritized

### Manual Updates
```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package@latest
```

## 🌐 Live URL

After deployment, your notes app will be available at:
```
https://yourdomain.com/notes/
```

## 📝 Deployment History

Each deployment creates a summary with:
- Deployment status
- Commit hash
- Branch name
- Timestamp

Check the **Actions** tab in your GitHub repository to see deployment history and logs.

## 🛠️ Troubleshooting

### Deployment Fails
1. Check the Actions tab for error logs
2. Verify FTP credentials in repository secrets
3. Ensure FTP server allows connections from GitHub's IP ranges
4. Check if `/notes/` directory exists on server

### Build Fails
1. Check TypeScript compilation: `npx tsc --noEmit`
2. Verify all dependencies are installed: `npm ci`
3. Check for syntax errors in the code

## 🔐 Security Notes

- FTP credentials are stored securely as GitHub secrets
- Only `dist/` folder is deployed (no source code)
- `.env` files and sensitive data are excluded from deployment
