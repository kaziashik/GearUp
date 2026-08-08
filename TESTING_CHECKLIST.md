# Website Testing Checklist

## 🚀 How to Test

### 1. Start the Development Server
```bash
cd Frontend
npm run dev
```
Then open: http://localhost:3000

---

## ✅ Testing Checklist

### **A. Home Page (/)** 
- [ ] Hero section loads with animated background
- [ ] Floating SVG shapes animate smoothly
- [ ] Gradient background flows continuously
- [ ] Text fades in with staggered timing
- [ ] "Adventure Instantly" text has animated gradient
- [ ] Browse Gear button works
- [ ] Join as Provider button works
- [ ] All sections scroll smoothly
- [ ] Featured gear cards display correctly
- [ ] All images load (no 404 errors)
- [ ] Responsive on mobile (test at 375px, 768px, 1024px)
- [ ] Navbar works on mobile (hamburger menu)
- [ ] Footer displays correctly (compact size)
- [ ] All footer links work

### **B. Browse Gear Page (/gear)**
- [ ] Page loads without hero section (direct to content)
- [ ] Filters sidebar displays compactly
- [ ] No border/card background on filters
- [ ] Full-width layout (minimal side gaps)
- [ ] Search filter works
- [ ] Category dropdown works
- [ ] Brand filter works
- [ ] Price range filters work
- [ ] Sort dropdown works (Default, Price, Rating, Name)
- [ ] "12 items found" displays correctly
- [ ] Gear cards display in grid (3 columns on desktop)
- [ ] "Available" badges show on cards
- [ ] Rent buttons work
- [ ] Pagination works
- [ ] Mobile filter toggle button works
- [ ] Filters collapsible on mobile
- [ ] Grid responsive (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] All placeholder images load correctly
- [ ] Clicking a gear card navigates to details

### **C. Gear Details Page (/gearDetails/[id])**
- [ ] Page loads with gear details
- [ ] Images display correctly (no 404s)
- [ ] Image gallery works
- [ ] Gear name, price, description display
- [ ] Provider info displays
- [ ] Date pickers work
- [ ] "Rent Now" button works
- [ ] Reviews section displays
- [ ] Rating stars display correctly
- [ ] Responsive layout works

### **D. Authentication Pages**
- [ ] Login page (/login) loads
- [ ] Register page (/register) loads
- [ ] Google login button appears
- [ ] Form validation works
- [ ] Demo login buttons work
- [ ] Error messages display
- [ ] Success redirects work
- [ ] Image upload works (optional profile image)
- [ ] Image preview shows on selection

### **E. Dashboard Pages**

#### Customer Dashboard (/customer-dashboard)
- [ ] Dashboard loads
- [ ] Stat cards display
- [ ] Charts render correctly
- [ ] Orders table displays
- [ ] Payments table displays
- [ ] Profile page loads
- [ ] Profile image upload works
- [ ] "My Orders" page works
- [ ] Action buttons (Pay, Cancel, Review) work
- [ ] Tables horizontally scroll on mobile

#### Provider Dashboard (/provider-dashboard)
- [ ] Dashboard loads
- [ ] Stat cards display
- [ ] Charts render correctly
- [ ] Gear management table works
- [ ] Orders table displays
- [ ] Profile page loads
- [ ] Profile image upload works
- [ ] Tables horizontally scroll on mobile

#### Admin Dashboard (/admin-dashboard)
- [ ] Dashboard loads
- [ ] All stat cards display
- [ ] Charts render correctly
- [ ] Users table works (search, filter, pagination)
- [ ] Suspend/Activate buttons work
- [ ] Gear management works
- [ ] Rentals table displays
- [ ] Profile page loads
- [ ] Tables horizontally scroll on mobile

### **F. Other Pages**
- [ ] Blog page (/blog) loads
- [ ] Blog posts display with images (no 404s)
- [ ] Contact page (/contact) loads
- [ ] Contact form works
- [ ] Help page (/help) loads
- [ ] FAQ sections display
- [ ] Search functionality works
- [ ] Terms of Service (/terms) loads
- [ ] Privacy Policy (/privacy) loads

### **G. Payment Flow**
- [ ] Payment selection page loads
- [ ] Stripe option works
- [ ] SSLCommerz shows "not available" message
- [ ] Redirects to Stripe checkout
- [ ] Success page (/payment/success) loads
- [ ] Cancel page (/payment/cancel) loads
- [ ] Payment confirmation completes

### **H. Responsive Design Testing**

#### Mobile (375px - 767px)
- [ ] Navbar hamburger menu works
- [ ] All text readable
- [ ] Buttons touch-friendly (min 44px)
- [ ] Forms easy to fill
- [ ] Tables scroll horizontally
- [ ] Filters collapsible
- [ ] Footer compact and readable
- [ ] No horizontal overflow

#### Tablet (768px - 1023px)
- [ ] Layout adjusts properly
- [ ] Grids use 2 columns
- [ ] Navbar expands
- [ ] All content accessible

#### Desktop (1024px+)
- [ ] Full layout displays
- [ ] Grids use 3 columns
- [ ] Filters sidebar always visible
- [ ] All animations smooth

### **I. Animations & Performance**
- [ ] Hero animations smooth (60fps)
- [ ] Floating shapes move smoothly
- [ ] No janky scrolling
- [ ] Page transitions smooth
- [ ] Loading states display
- [ ] Skeleton loaders work

### **J. Critical Functionality**
- [ ] User authentication works
- [ ] Logout works
- [ ] Token refresh works (cookie-based)
- [ ] Protected routes redirect to login
- [ ] Role-based access control works
- [ ] Image compression works (< 5MB)
- [ ] Form validation shows errors
- [ ] Toast notifications appear
- [ ] Custom confirmation dialog works (not browser alert)

---

## 🐛 Known Issues to Check

### Potential Issues from Changes:
1. **Animations**: Check if animations cause any lag
2. **Full-width layout**: Ensure content doesn't look stretched
3. **Compact sizes**: Verify text is still readable
4. **Removed hero**: Make sure Browse Gear page doesn't look empty
5. **Filter changes**: Ensure filters still functional

---

## 📝 Testing Results Template

```
✅ PASSED:
- [List working features]

❌ FAILED:
- [List broken features]

⚠️ ISSUES:
- [List minor issues]

💡 SUGGESTIONS:
- [List improvements]
```

---

## 🔧 How to Fix Common Issues

### If animations don't work:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### If images don't load:
- Check `next.config.js` remote patterns
- Verify placeholder URLs are correct

### If styles look wrong:
```bash
# Rebuild CSS
npm run build
npm run dev
```

### If responsive breaks:
- Check Tailwind classes
- Verify breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

---

## 🎯 Priority Testing Order

1. **Critical**: Login, Browse Gear, Gear Details, Payment
2. **High**: Dashboards, Profile, Orders
3. **Medium**: Blog, Contact, Help
4. **Low**: Terms, Privacy, Footer links

---

## ✨ What to Look For

### Good Signs:
- ✅ Smooth animations
- ✅ Fast page loads
- ✅ No console errors
- ✅ All images load
- ✅ Responsive works perfectly
- ✅ No horizontal scroll
- ✅ Readable text sizes
- ✅ Functional buttons/forms

### Bad Signs:
- ❌ Console errors (F12)
- ❌ 404 image errors
- ❌ Layout breaks on mobile
- ❌ Janky animations
- ❌ Buttons not working
- ❌ Text too small
- ❌ Horizontal overflow
- ❌ Missing content

---

## 📊 Testing Report

After testing, report back with:
1. Pages that work perfectly ✅
2. Pages with issues ❌
3. Specific errors found 🐛
4. Screenshots if needed 📸

---

**Start Testing Now!** 🚀
Run `npm run dev` and go through each section systematically.
