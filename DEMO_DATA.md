# GearUp Demo Data Guide

Run these commands to load dummy data with real images:

```bash
cd Backand
npx prisma db push
npm run db:seed
```

Then start backend + frontend:

```bash
# Terminal 1
cd Backand && npm run dev

# Terminal 2
cd Frontend && npm run dev
```

Open **http://localhost:3000**

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gearup.com | Admin@123 |
| Provider | provider@gearup.com | Provider@123 |
| Provider | outdoorhub@gearup.com | Provider@123 |
| Customer | customer@gearup.com | Customer@123 |
| Customer | mike.adventures@gearup.com | Customer@123 |

---

## Demo Data Included

### 6 Categories (with images)
- Cycling, Camping, Fitness, Water Sports, Winter Sports, Climbing

### 12 Gear Items (Unsplash images)
| Gear | Price/Day | Provider |
|------|-----------|----------|
| TrailMaster X7 Mountain Bike | $45 | Alpine Sports |
| SpeedMax Carbon Road Bike | $55 | Alpine Sports |
| OutdoorLife 4-Person Tent | $28 | Alpine Sports |
| Summit Pro Sleeping Bag | $12 | Alpine Sports |
| SnowPeak All-Mountain Skis | $65 | Alpine Sports |
| RockSafe Climbing Harness Kit | $22 | Alpine Sports |
| FitPro Adjustable Dumbbells | $18 | Outdoor Hub |
| PowerRack Home Gym Station | $35 | Outdoor Hub |
| AquaRide Inflatable Kayak | $38 | Outdoor Hub |
| WaveGlide SUP Board | $32 | Outdoor Hub |
| DeepBlue Snorkel Set | $10 | Outdoor Hub |
| CampChef Portable Stove | $15 | Outdoor Hub |

### Sample Rental Orders (test all statuses)
| Status | Who | What to test |
|--------|-----|--------------|
| RETURNED | Sarah (customer) | View history, see review on mountain bike |
| RETURNED | Mike (customer) | Review on dumbbells |
| CONFIRMED | Sarah | Customer → **Pay Now** button |
| PLACED | Mike | Provider → **Confirm** button |
| PAID | Mike | Provider → **Mark Picked Up** |
| PICKED_UP | Sarah | Provider → **Mark Returned** |

### Payments & Reviews
- 3 completed payments (Stripe + SSLCommerz)
- 2 reviews on returned gear

---

## Quick Test Flow

1. **Browse** → http://localhost:3000/gear (see images + filters)
2. **Login as customer** → customer@gearup.com / Customer@123
3. **Rent gear** → open any item → pick dates → Rent Now
4. **Login as provider** → provider@gearup.com / Provider@123
5. **Manage orders** → /provider-dashboard/orders
6. **Login as admin** → admin@gearup.com / Admin@123
7. **Manage users** → /admin-dashboard/users
