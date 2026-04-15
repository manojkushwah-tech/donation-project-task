# Payment System - Deployment & Production Guide

## Pre-Deployment Checklist

### 1. Code Quality
- [ ] All payment services tested
- [ ] Controllers handle errors properly
- [ ] Validators are strict
- [ ] No sensitive data in logs
- [ ] Comments added to complex logic
- [ ] Error messages are user-friendly

### 2. Security
- [ ] Razorpay Key Secret in `.env` only
- [ ] Environment variables documented
- [ ] HTTPS configured for all endpoints
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Password encryption verified
- [ ] JWT tokens implemented
- [ ] Admin routes protected
- [ ] Signature verification working

### 3. Database
- [ ] MongoDB connection tested
- [ ] Indexes created
- [ ] Backups configured
- [ ] Connection pooling set
- [ ] Replica set configured (for production)
- [ ] Data encryption at rest enabled

### 4. Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Signature verification tested
- [ ] Email validation tested
- [ ] Payment creation tested
- [ ] Payment verification tested
- [ ] Refund functionality tested
- [ ] Admin endpoints tested
- [ ] Error handling tested
- [ ] Rate limiting tested

### 5. Documentation
- [ ] API documentation complete
- [ ] Setup guide finished
- [ ] Frontend guide completed
- [ ] Quick reference created
- [ ] Code comments added
- [ ] Error codes documented

### 6. Performance
- [ ] Database indexes verified
- [ ] Query performance checked
- [ ] Pagination implemented
- [ ] Lean queries used
- [ ] Connection pooling enabled
- [ ] Caching strategy defined

### 7. Monitoring & Logging
- [ ] Logging configured
- [ ] Log rotation set up
- [ ] Error monitoring enabled
- [ ] Performance metrics tracked
- [ ] Health checks implemented
- [ ] Alert system configured

---

## Development to Staging

### 1. Environment Setup
```bash
# Copy production environment template
cp .env.example .env.staging

# Update with staging values
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx  # Use test keys first
RAZORPAY_KEY_SECRET=test_secret
NODE_ENV=staging
DATABASE_URL=mongodb://staging-db:27017/donationDB
JWT_SECRET=staging_secret_min_32_chars
```

### 2. Install & Build
```bash
npm ci  # Clean install
npm run build  # If applicable
npm run test  # Run tests
```

### 3. Database Migrations
```bash
# Ensure indexes are created
# MongoDB creates them automatically
npm run seed  # If seed data needed
```

### 4. Run on Staging
```bash
NODE_ENV=staging npm start
```

### 5. Verify Endpoints
```bash
# Test all endpoints
npm run test:integration

# Manual testing
curl -X GET http://staging:5000/api/v1/payment/admin/all-payments
```

---

## Staging to Production

### 1. Get Live Razorpay Keys
Login to Razorpay Dashboard:
1. Settings → API Keys
2. Switch to "Live" (if not already)
3. Copy Live Key ID and Live Key Secret

### 2. Prepare Production Environment
```bash
# Create production environment file
cp .env.example .env.production

# Update with production values
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx  # Use live keys!
RAZORPAY_KEY_SECRET=your_live_key_secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/donationDB
JWT_SECRET=production_secret_min_32_chars_long
FRONTEND_URL=https://yourdomain.com
```

### 3. Database Backup
```bash
# Before deployment, backup database
mongodump --uri="mongodb://connection-string" --out=./backup_$(date +%Y%m%d)

# Verify backup
ls -la ./backup_*
```

### 4. SSL/HTTPS Certificate
```bash
# Install SSL certificate (using Let's Encrypt)
sudo certbot certonly --standalone -d yourdomain.com

# Update Node.js app or use reverse proxy
# Example using nginx as reverse proxy
```

### 5. Nginx Configuration (Optional)
```nginx
upstream nodejs {
  server 127.0.0.1:5000;
}

server {
  listen 443 ssl;
  server_name yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  location /api/v1/payment/ {
    proxy_pass http://nodejs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### 6. Deploy Application

**Using PM2:**
```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: "donation-api",
    script: "./src/server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production"
    }
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 startup
pm2 save
pm2 startup
```

**Using Docker:**
```bash
# Build Docker image
docker build -t donation-api:1.0.0 .

# Run container
docker run -d \
  --name donation-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e RAZORPAY_KEY_ID=rzp_live_xxx \
  -e RAZORPAY_KEY_SECRET=secret \
  -e MONGODB_URI=mongodb+srv://... \
  donation-api:1.0.0

# Or use docker-compose
docker-compose -f docker-compose.yml up -d
```

### 7. Verify Production Deployment

```bash
# Check application is running
curl https://yourdomain.com/api/v1/payment/admin/all-payments \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Check logs
pm2 logs
# or
docker logs donation-api

# Check database connection
curl https://yourdomain.com/api/v1/payment/admin/statistics

# Test payment creation
curl -X POST https://yourdomain.com/api/v1/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "9876543210",
    "amount": 100
  }'
```

---

## Monitoring Setup

### 1. Application Monitoring
```bash
# Using PM2 Monitoring
pm2 install pm2-uptime
pm2 update

# Using Sentry for errors
npm install @sentry/node
```

### 2. Database Monitoring
```bash
# Enable MongoDB replication
# Set up automated backups
# Configure alerts for connection failures
```

### 3. Performance Monitoring
```bash
# Using New Relic or similar
npm install newrelic

# Configure apm
```

### 4. Logging
```bash
# Using Winston (already configured)
# Logs go to ./logs/ directory
# Implement log rotation and cleanup
```

---

## Post-Deployment Checklist

### 1. Functionality
- [ ] Create payment order works
- [ ] Verify payment works
- [ ] Get payments works
- [ ] Admin endpoints accessible
- [ ] Refund processing works
- [ ] Analytics working
- [ ] Top donors calculation correct

### 2. Security
- [ ] HTTPS working
- [ ] Signature verification working
- [ ] JWT validation working
- [ ] Admin routes protected
- [ ] No sensitive data in logs
- [ ] Rate limiting working

### 3. Performance
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] CPU usage normal
- [ ] Load time reasonable

### 4. Monitoring
- [ ] Errors being logged
- [ ] Performance metrics recorded
- [ ] Alerts configured
- [ ] Dashboards setup
- [ ] Health checks running

### 5. Backups
- [ ] Automated backups running
- [ ] Backup verification scheduled
- [ ] Restore procedure documented
- [ ] Backup retention policy set

---

## Rollback Procedure

If something goes wrong in production:

### 1. Immediate Actions
```bash
# Stop current deployment
pm2 stop donation-api
# or
docker stop donation-api

# Restore from last working version
git checkout last-working-commit
npm ci
npm run build
```

### 2. Restore Database
```bash
# If data was corrupted
mongorestore --uri="mongodb://connection" ./backup_latest

# Verify data integrity
mongo --eval 'db.payments.findOne()'
```

### 3. Redeploy
```bash
# Deploy previous working version
pm2 start ecosystem.config.js

# Verify
curl https://yourdomain.com/api/v1/payment/admin/statistics
```

### 4. Notify Teams
- Notify admin of rollback
- Update status page
- Check user complaints
- Root cause analysis

---

## Performance Optimization

### 1. Database
```javascript
// Use indexes
db.payments.createIndex({ user: 1, createdAt: -1 });

// Lean queries
Payment.find({}).lean()

// Pagination
skip((page - 1) * limit).limit(limit)
```

### 2. Caching
```javascript
// Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache top donors
client.setex('top_donors', 3600, JSON.stringify(topDonors));
```

### 3. CDN
- Use CDN for static assets
- Cache API responses appropriately
- Set proper cache headers

### 4. Load Balancing
```nginx
upstream nodejs_backend {
  server 127.0.0.1:5000 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:5001 max_fails=3 fail_timeout=30s;
  server 127.0.0.1:5002 max_fails=3 fail_timeout=30s;
}
```

---

## Scaling Strategy

### Horizontal Scaling
```bash
# Run multiple instances
NODE_ENV=production npm start &
NODE_ENV=production npm start &
NODE_ENV=production npm start &

# Use load balancer in front
# Nginx or AWS ALB recommended
```

### Vertical Scaling
```bash
# Use PM2 cluster mode
instances: "max"  # Uses all CPU cores
exec_mode: "cluster"
```

### Database Scaling
```mongodb
# Use MongoDB replication
rs.initiate()

# Sharding for very large datasets
sh.enableSharding("donationDB")
```

---

## Cost Optimization

### Razorpay Fees
- **2% + ₹3**: Credit/Debit Card
- **1% + ₹3**: Netbanking
- **0.5% + ₹3**: UPI
- Calculate in pricing strategy

### Server Costs
- Start with single server
- Scale based on traffic
- Use auto-scaling in cloud

### Database Costs
- MongoDB Atlas: Pay as you go
- AWS DocumentDB: Reserved instances cheaper

---

## Disaster Recovery

### Backup Strategy
1. **Daily Backups**
   - Automated MongoDB backups
   - Store in S3/cloud storage
   - Keep 30 days of backups

2. **Weekly Full Backup**
   - Complete database dump
   - Test restore process
   - Keep 12 weeks

3. **Monthly Archive**
   - Long-term storage
   - Keep 2 years
   - Cold storage for cost

### Recovery Time Objectives (RTO)
- **Critical Data**: < 1 hour
- **Non-critical**: < 24 hours

### Recovery Point Objective (RPO)
- Aim for < 4 hours data loss
- Payment data: < 1 hour

---

## Incident Response

### Payment System Down
1. Check server status: `pm2 status`
2. Check database connection
3. Check Razorpay API status
4. Review recent logs
5. Restart if needed
6. Notify users if down > 5 minutes

### Payment Verification Fails
1. Check signature: Compare secret
2. Check order details: Verify IDs
3. Check Razorpay dashboard
4. Check network connectivity
5. Escalate to Razorpay if needed

### Data Corruption
1. Stop updates immediately
2. Activate read-only mode
3. Restore from backup
4. Verify data integrity
5. Resume operations

---

## Compliance & Security

### PCI DSS Compliance
- [ ] Use tokenized payments (Razorpay handles)
- [ ] Never store card details
- [ ] Use HTTPS/TLS
- [ ] Maintain audit logs
- [ ] Regular security assessments

### Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for transit
- [ ] GDPR compliant data handling
- [ ] Right to deletion implemented
- [ ] Data retention policy set

### Security Audits
- [ ] Monthly security review
- [ ] Quarterly penetration testing
- [ ] Annual third-party audit
- [ ] Keep audit logs

---

## Regular Maintenance

### Weekly
- [ ] Check error logs
- [ ] Review failed payments
- [ ] Monitor server health
- [ ] Check backup success

### Monthly
- [ ] Security updates
- [ ] Database optimization
- [ ] Performance review
- [ ] Backup restoration test

### Quarterly
- [ ] System upgrade
- [ ] Security assessment
- [ ] Capacity planning
- [ ] Disaster recovery drill

### Annually
- [ ] Full system audit
- [ ] Third-party security review
- [ ] Compliance verification
- [ ] Cost optimization review

---

## Contact Information

### Razorpay Support
- Email: support@razorpay.com
- Phone: 1800-102-8282
- Website: https://support.razorpay.com

### Your Team
- Tech Lead: [Name]
- Database Admin: [Name]
- DevOps: [Name]
- On-Call: [Rotation Schedule]

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2025 | Initial release |
| 1.0.1 | Planning | TBA |

---

## Sign-Off

- **Prepared By**: [Developer Name]
- **Reviewed By**: [Tech Lead]
- **Approved By**: [Manager]
- **Date**: [Date]

---

**Status**: ✅ Ready for Production Deployment

**Next Step**: Follow the "Development to Staging" section to begin deployment process.
