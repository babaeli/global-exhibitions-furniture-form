# Deploying to Vercel

## Prerequisites

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Create a Vercel account** at https://vercel.com if you don't have one

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate

2. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

   This will:
   - Upload all your files
   - Deploy to production
   - Give you a live URL

3. **That's it!** You'll get a URL like:
   ```
   https://global-exhibitions-furniture-form.vercel.app
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new

2. Click **"Add New Project"**

3. **Import Git Repository** OR **Upload Files**:
   - If using Git: Connect your GitHub/GitLab account
   - If uploading: Drag and drop this entire folder

4. Configure:
   - **Project Name**: `global-exhibitions-furniture-form`
   - **Framework Preset**: Other (or None)
   - **Root Directory**: `./`

5. Click **"Deploy"**

6. Wait for deployment to complete

7. Get your live URL!

### Option 3: Deploy with Git (Continuous Deployment)

1. **Initialize Git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Global Exhibitions furniture form"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Follow instructions to push your code

3. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click Deploy

4. **Automatic Updates**:
   - Every push to main branch will auto-deploy!

## Environment Configuration

Your form is completely static (HTML, CSS, JS), so no environment variables are needed!

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `furniture.globalexhibitions.africa`)
4. Follow DNS configuration instructions

## What Gets Deployed

✅ `index.html` - Main form
✅ `styles.css` - All styling
✅ `script.js` - Form functionality
✅ `images/` - All 52+ product images
✅ `README.md` - Documentation

## Testing Your Deployment

After deployment, test these features:

1. ✅ All images load correctly
2. ✅ Form fields work properly
3. ✅ Calculations update in real-time
4. ✅ Late fee checkbox adds 50% surcharge
5. ✅ Form submission works
6. ✅ Order summary downloads
7. ✅ Mobile responsive design
8. ✅ Print functionality

## Vercel Benefits

- ✅ **Free SSL certificate** (HTTPS)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Automatic scaling**
- ✅ **Zero configuration**
- ✅ **Free hosting** for static sites
- ✅ **Custom domains** supported

## Updating Your Site

To update after making changes:

```bash
vercel --prod
```

Or with Git:
```bash
git add .
git commit -m "Update description"
git push
```
(Auto-deploys if connected to Git)

## Troubleshooting

**Images not loading?**
- Check that `images/` folder uploaded correctly
- Verify image file names match references in HTML

**Form not working?**
- Check browser console for JavaScript errors
- Ensure `script.js` uploaded successfully

**Need help?**
- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support

---

## Your Project Structure

```
global-exhibitions-furniture-form/
├── index.html          # Main form
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── images/             # Product images (52+ files)
│   ├── seamless.png
│   ├── panel-branding.png
│   └── ...
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
├── README.md           # Documentation
└── DEPLOYMENT.md       # This file
```

## Next Steps After Deployment

1. 📧 Share the Vercel URL with your team
2. 🧪 Test all form features thoroughly
3. 🌐 (Optional) Add custom domain
4. 📱 Test on mobile devices
5. 🎉 Start receiving orders!

---

**Deployed by:** Global Exhibitions Inc.
**Form Version:** 1.0.0
**Year:** 2026
