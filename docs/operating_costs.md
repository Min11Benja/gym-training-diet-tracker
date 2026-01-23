# CoachEnControl - Monthly Operating Costs (Beta)
**Infrastructure & Service Cost Breakdown**

**Last Updated:** January 22, 2026  
**Status:** Beta Phase (50 coaches target)

---

## 💰 Cost Summary

### Beta Phase (10-50 Coaches)
| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| **Google Cloud Run** | $0 - $25 | Free tier covers beta |
| **Convex Backend** | $0 - $25 | Free tier → Starter |
| **Gemini AI** | $0 - $75 | Free tier → paid |
| **WhatsApp Business API** | $50 - $200 | Conversation-based pricing |
| **Cloudflare Domain** | $0.75 | ~$9/year (at-cost) |
| **Total Beta** | **$51 - $326/month** | **Avg: ~$145/month** |

### Scale Phase (500 Coaches)
| Service | Monthly Cost |
|---------|--------------|
| **Google Cloud Run** | $50 - $100 |
| **Convex Starter** | $25 |
| **Gemini AI** | $500 - $1,500 |
| **WhatsApp API** | $2,000 - $5,000 |
| **Cloudflare Domain** | $0.75 |
| **Total Scale** | **$2,576 - $6,626/month** |

---

## 📊 Detailed Cost Breakdown

### 1. Hosting - Google Cloud Run

**Why Google Cloud Run:**
- ✅ Serverless, auto-scaling
- ✅ Pay only for what you use
- ✅ Free tier covers beta testing
- ✅ Native integration with Gemini AI
- ✅ Better cost at scale vs Vercel
- ✅ Full control over infrastructure

**Pricing:**
- **Free Tier (Always Free):**
  - 2 million requests/month
  - 360,000 vCPU-seconds/month
  - 180,000 GiB-seconds/month
  - **Good for:** 20-40 coaches in beta
  
- **Paid Usage:**
  - **Requests:** $0.40 per million
  - **CPU:** $0.00002400 per vCPU-second
  - **Memory:** $0.00000250 per GiB-second
  - **Minimum instances (optional):** $0.60/instance/day

**Beta Estimate (10-50 coaches):**
- 500K requests/month → **Free**
- CPU/Memory → **Free** (within tier)
- **Total:** $0-25/month

**Scale Estimate (500 coaches):**
- 5M requests/month → $1.20
- CPU usage → $30-50
- Memory → $15-20
- Optional: 1 min instance for speed → $18
- **Total:** $50-100/month

**Additional Services:**
- **Cloud Storage:** $0.026/GB/month (~$2-5/month for images)
- **Cloud CDN:** $0.08/GB (~$5-10/month)
- **Load Balancer:** $18/month (optional, only at scale)

**Beta Strategy:** Use free tier + Cloud CDN, avoid min instances until 100+ coaches.

---

### 2. Backend - Convex

**Why Convex:**
- ✅ Real-time database (perfect for coach/client updates)
- ✅ Built-in auth
- ✅ TypeScript-first
- ✅ No infrastructure management

**Pricing:**
- **Free Tier:**
  - 1M function calls/month
  - 1 GB storage
  - **Good for:** 20-30 active coaches

- **Starter ($25/month):**
  - 10M function calls
  - 5 GB storage
  - Priority support
  - **Good for:** 50-200 coaches

- **Pro ($100/month):**
  - Unlimited calls
  - 25 GB storage
  - SLA guarantees

**Estimate:**
- Beta (10-50 coaches): **$0-25/month**
- Scale (500 coaches): **$25-100/month**

**Beta Strategy:** Stay on free tier until 30 coaches, then upgrade to Starter.

---

### 3. AI - Gemini 1.5 Flash

**Pricing:**
- **Input:** $0.075 per 1M tokens
- **Output:** $0.30 per 1M tokens
- **Free Tier:** 1M tokens/month

**Usage Estimates:**

**Per AI Message:**
- Input: ~500 tokens (client context + coach settings)
- Output: ~200 tokens (draft message)
- **Cost:** ~$0.023/message

**Beta Scenario (50 coaches, 20 clients avg):**
- 1,000 clients total
- 2 AI messages/client/week = 8,000 messages/month
- **Cost:** ~$184/month
- **With Free Tier:** ~$75/month (offset first 1M tokens)

**Scale Scenario (500 coaches):**
- 10,000 clients
- 80,000 messages/month
- **Cost:** ~$1,840/month

**Cost Control:**
```typescript
// Implement daily limits per coach
const AI_LIMITS = {
  free: 10,    // 10 AI messages/month
  starter: 50, // 50 AI messages/month
  pro: 200     // 200 AI messages/month
};
```

**Beta Strategy:** 
- Use free tier for first 10 coaches
- Implement aggressive caching
- Cap at 100 messages/coach/month

---

### 4. WhatsApp Business API

**Provider Options:**

**Twilio (Easiest)**
- **Setup:** $0
- **Conversation-based pricing:**
  - Marketing: $0.0065/conversation (first 1,000 free)
  - Utility: $0.0042/conversation
  - Service: $0.0050/conversation

**Meta Cloud API (Cheaper at scale)**
- **Setup:** Free
- **Pricing:** $0.0031-0.0055/conversation
- **Free Tier:** 1,000 conversations/month

**Conversation = 24-hour window** (multiple messages = 1 conversation)

**Beta Estimate (50 coaches, 1,000 clients):**
- 2 conversations/client/week = 8,000/month
- **Cost:** $40-50/month (after free tier)

**Scale Estimate (500 coaches, 10,000 clients):**
- 80,000 conversations/month
- **Cost:** $250-440/month

**Beta Strategy:**
- Use Meta Cloud API (free 1K conversations)
- Set conversation limits per coach
- Batch messages to minimize conversations

---

### 5. Domain & DNS - Cloudflare

**Why Cloudflare:**
- ✅ **At-cost domain pricing** (no markup)
- ✅ **Free SSL certificates** (automatic)
- ✅ **Free DDoS protection** (enterprise-grade)
- ✅ **Free CDN** (global edge network)
- ✅ **Free DNS** (fastest in industry)
- ✅ **Analytics included**

**Pricing:**
- **.com registration:** ~$9.15/year (~$0.76/month)
- **.app:** ~$15/year (~$1.25/month)
- **DNS:** Free (unlimited)
- **SSL:** Free (auto-renewing)
- **DDoS Protection:** Free (unlimited)
- **CDN:** Free (unlimited bandwidth)
- **Email Routing:** Free (forward to Gmail)

**Cloudflare Plans:**
- **Free:** Perfect for beta
  - Unlimited DDoS protection
  - Global CDN
  - SSL/TLS encryption
  - Basic WAF rules
  
- **Pro ($20/month):** Only if needed at scale
  - Advanced DDoS
  - Image optimization
  - 20+ page rules

**Recommendation:** `coachencontrol.com` via Cloudflare - $9.15/year

**Beta Strategy:** 
- Register domain on Cloudflare immediately
- Use free tier (covers all beta needs)
- Enable DDoS protection from day 1
- Set up email routing to personal Gmail

---

### 6. Additional Services (Optional)

**Email (Resend - for form submissions):**
- **Free:** 100 emails/day
- **Paid:** $20/month (50K emails)
- **Beta:** Free tier sufficient

**Analytics (Posthog):**
- **Free:** 1M events/month
- **Beta:** Free tier sufficient

**Error Tracking (Sentry):**
- **Free:** 5K errors/month
- **Beta:** Free tier sufficient

**Monitoring (Better Uptime):**
- **Free:** 5 monitors
- **Beta:** Free tier sufficient

---

## 🚨 Beta Cost Control Strategies

### 1. Implement Usage Caps

```typescript
// convex/rateLimits.ts
export const BETA_LIMITS = {
  aiMessages: {
    perCoach: 100,    // per month
    perClient: 10,    // per month
  },
  whatsapp: {
    perCoach: 500,    // conversations per month
  },
};

export async function checkLimit(type, id, limit) {
  const usage = await getUsage(type, id);
  if (usage >= limit) {
    throw new Error(`Beta limit reached: ${limit} ${type}/month`);
  }
}
```

---

### 2. Aggressive Caching

```typescript
// Cache AI responses for 24 hours
const aiCache = new Map();

async function getCachedResponse(prompt) {
  const key = hash(prompt);
  if (aiCache.has(key)) {
    return aiCache.get(key); // Save $0.023
  }
  
  const response = await gemini.generate(prompt);
  aiCache.set(key, response);
  return response;
}
```

---

### 3. Free Tier Maximization

**Convex Free Tier Tricks:**
- Use cron jobs for batch processing (not real-time)
- Paginate queries to reduce function calls
- Cache frequently accessed data in client

**Gemini Free Tier Tricks:**
- Stay under 15 RPM (requests per minute)
- Use shorter prompts (compress context)
- Implement template fallbacks

**WhatsApp Free Tier:**
- Batch messages within 24-hour windows
- Avoid triggering new conversations unnecessarily

---

### 4. Monitoring & Alerts

```typescript
// Set up cost alerts
export const COST_ALERTS = {
  gemini: {
    threshold: 100,  // $100/month
    email: "admin@coachencontrol.com",
  },
  whatsapp: {
    threshold: 150,  // $150/month
  },
  total: {
    threshold: 300,  // $300/month total
  },
};
```

**Weekly Dashboard:**
- Current month spend by service
- Projected month-end cost
- Per-coach cost breakdown
- Top 10 highest-cost coaches

---

### 5. Beta Pricing Tiers

**Coach Pricing (Covers Costs):**

| Tier | Price | AI Msgs | WhatsApp | Coaches |
|------|-------|---------|----------|---------|
| **Free Beta** | $0 | 10/mo | 50/mo | First 10 |
| **Starter** | $29/mo | 100/mo | 500/mo | 11-50 |
| **Pro** | $79/mo | Unlimited | Unlimited | 50+ |

**Cost Coverage:**
- Starter: $29 × 40 coaches = $1,160/mo (covers all costs)
- Pro: $79 × 10 coaches = $790/mo (pure profit)

---

## ⚠️ What to Watch Out For

### 1. Runaway AI Costs
**Danger:** One coach spamming AI = $500/month alone

**Prevention:**
```typescript
// Hard limit AI calls per coach
if (coachAICalls > 200) {
  throw new Error("Monthly AI limit reached");
}
```

---

### 2. WhatsApp Conversation Loops
**Danger:** Client replies trigger more AI → more WhatsApp → infinite loop

**Prevention:**
- Only respond to client-initiated messages
- Cap responses per 24hr window
- Require coach approval for automated sends

---

### 3. Database Query Explosions
**Danger:** Real-time subscriptions on large tables = millions of function calls

**Prevention:**
- Paginate all queries
- Use indexes properly
- Limit real-time subscriptions to critical views only

---

### 4. Free Tier Cliff
**Danger:** Hit limits suddenly, app breaks for all users

**Prevention:**
- Set alerts at 80% of free tier limits
- Graceful degradation (fallback to templates)
- Warn coaches before hitting limits

---

## 📈 Cost Projections

### Months 1-3 (Beta Launch)
- Coaches: 10 → 30
- Monthly Cost: $50 → $150
- Revenue: $0 (free beta) → $870 (30 × $29)
- **Margin:** -$50 → +$720

### Months 4-6 (Growth)
- Coaches: 30 → 100
- Monthly Cost: $150 → $400
- Revenue: $2,900 (100 × $29)
- **Margin:** +$2,500

### Month 12 (Scale)
- Coaches: 500
- Monthly Cost: $3,000
- Revenue: $39,500 (500 × $79)
- **Margin:** +$36,500

---

## ✅ Beta Cost Checklist

**Before Launch:**
- [ ] Set up billing alerts on all platforms
- [ ] Implement rate limiting in code
- [ ] Configure caching for AI responses
- [ ] Test free tier limits with dummy data
- [ ] Create cost monitoring dashboard

**Week 1:**
- [ ] Monitor daily costs (target: \u003c$5/day)
- [ ] Check for any runaway processes
- [ ] Verify rate limits are working

**Monthly:**
- [ ] Review per-coach cost breakdown
- [ ] Optimize highest-cost operations
- [ ] Adjust limits if needed

---

## 🎯 Breakeven Analysis

**Fixed Costs (Beta):** ~$150/month

**Breakeven:** 6 paying coaches @ $29/mo

**Profitable:** 10+ paying coaches

**Safe Zone:** 30 coaches = $870/mo revenue - $150 costs = **$720 profit**

---

## 📝 Recommendations

1. **Start Free:** Use all free tiers for first 10 coaches
2. **Monitor Weekly:** Set up cost dashboards from Day 1
3. **Hard Limits:** Implement rate limits before launch
4. **Gradual Scaling:** Don't jump to paid tiers until 80% utilized
5. **Coach Caps:** Limit beta to 50 coaches initially

**Target Beta Spend:** $100-200/month max until product-market fit proven.
