# Deployment Guide

This guide covers how to deploy CryptoNested to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Supabase project

### Steps

1. **Fork the repository** to your GitHub account

2. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

3. **Set up the database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL to create all tables and policies

4. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Configure environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key (optional)
     ```
   - Deploy!

5. **Verify deployment**
   - Visit your deployed URL
   - Test user registration and login
   - Create a portfolio and add holdings
   - Test the staking functionality

## 🐳 Docker Deployment

### Build and run locally

```bash
# Build the Docker image
docker build -t cryptonested .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  cryptonested
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  cryptonested:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
      - NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## ☁️ Other Cloud Platforms

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Railway

1. Connect your GitHub repository to Railway
2. Add environment variables
3. Railway will automatically detect Next.js and deploy

### AWS Amplify

1. Connect your GitHub repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables
4. Deploy

## 🗄️ Database Setup

### Supabase Setup

1. **Create project** at [supabase.com](https://supabase.com)

2. **Run database schema**
   ```sql
   -- Copy contents from supabase/schema.sql
   -- Execute in Supabase SQL Editor
   ```

3. **Configure Row Level Security**
   - RLS policies are included in the schema
   - Verify they're enabled in the Authentication section

4. **Set up authentication**
   - Configure email templates (optional)
   - Set up OAuth providers (optional)
   - Configure redirect URLs for your domain

### Self-hosted PostgreSQL

If you prefer to use your own PostgreSQL instance:

1. **Create database**
   ```sql
   CREATE DATABASE cryptonested;
   ```

2. **Run schema**
   ```bash
   psql -d cryptonested -f supabase/schema.sql
   ```

3. **Update environment variables**
   ```env
   DATABASE_URL=postgresql://user:password@host:port/cryptonested
   ```

## 🔧 Environment Variables

### Required Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables

```env
# API Keys for enhanced features
NEXT_PUBLIC_COINGECKO_API_KEY=your-coingecko-key
NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Email (for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable Supabase RLS policies
- [ ] Use strong database passwords
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Supabase Security

1. **Row Level Security**
   - Ensure RLS is enabled on all tables
   - Test policies with different user roles
   - Regularly audit access patterns

2. **API Keys**
   - Use anon key for client-side
   - Keep service role key secure
   - Rotate keys regularly

3. **Authentication**
   - Configure password requirements
   - Set up email verification
   - Enable MFA for admin accounts

## 📊 Monitoring and Analytics

### Application Monitoring

1. **Vercel Analytics** (if using Vercel)
   - Automatically enabled
   - Monitor performance and usage

2. **Google Analytics**
   - Add GA_MEASUREMENT_ID to environment variables
   - Track user interactions and conversions

3. **Supabase Dashboard**
   - Monitor database performance
   - Track API usage
   - Set up alerts for errors

### Performance Optimization

1. **Caching**
   - API responses are cached
   - Static assets cached by CDN
   - Database query optimization

2. **Image Optimization**
   - Next.js Image component used
   - Automatic format optimization
   - Responsive image loading

3. **Bundle Optimization**
   - Tree shaking enabled
   - Code splitting implemented
   - Minimal bundle size

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all environment variables
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check network connectivity
   - Ensure RLS policies are correct

3. **Authentication Problems**
   - Check redirect URLs
   - Verify email templates
   - Test with different browsers

### Getting Help

- Check the [GitHub Issues](https://github.com/yourusername/cryptonested/issues)
- Review the [Contributing Guide](CONTRIBUTING.md)
- Join our community discussions

## 🔄 Updates and Maintenance

### Keeping Updated

1. **Watch the repository** for new releases
2. **Review CHANGELOG.md** for breaking changes
3. **Test updates** in staging environment first
4. **Backup database** before major updates

### Automated Updates

Consider setting up:
- Dependabot for dependency updates
- GitHub Actions for automated testing
- Automated deployment on merge to main

---

For more detailed information, see the main [README.md](README.md) file.
