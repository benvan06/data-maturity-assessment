# Data Maturity Assessment

A React-based interactive assessment tool to evaluate an organization's data maturity level.

## Features

- Multi-step quiz interface
- Lead capture form
- Integration with n8n webhook
- Responsive design with Tailwind CSS
- Results dashboard with maturity level classification

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

### Option 1: Via Git (Recommended)

1. Push this project to a GitHub repository
2. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
6. Click "Save and Deploy"

### Option 2: Direct Upload (Wrangler CLI)

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist --project-name=data-maturity-assessment
   ```

## Environment Configuration

The app currently uses:
- **Tailwind CSS** via CDN (in index.html)
- **n8n webhook** at `https://n8n.srv950234.hstgr.cloud/webhook-test/maturity-funnel`

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- n8n (webhook integration)
