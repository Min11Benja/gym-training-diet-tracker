# Seeding Demo Data

To populate the database with demo users and sample data:

1. Open Convex dashboard: https://dashboard.convex.dev
2. Go to your project
3. Click "Functions" tab
4. Run the mutation: `seed:seedDemoUsers`

This will create:
- **Coach user:** `coach@coachencontrol.com`
- **Client user:** `client@coachencontrol.com` (assigned to coach)
- Sample nutrition goals and food logs
- Sample workouts
- Body metrics for the last 7 days

## To Clear Demo Data

Run the mutation: `seed:clearDemoUsers`

## Alternative: Run from CLI

```bash
npx convex run seed:seedDemoUsers
```
