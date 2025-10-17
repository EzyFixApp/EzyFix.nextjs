# 🎨 EzyFix Landing Page

Landing page hiện đại cho thương hiệu EzyFix, được thiết kế theo phong cách chuyên nghiệp với gradient xanh đặc trưng. **Hoàn toàn hỗ trợ đa ngôn ngữ (i18n)** với Vietnamese và English.

## 📋 Cấu trúc Components

```
src/components/landing/
├── Navbar.tsx              # Navigation bar với scroll animation & i18n
├── Hero.tsx                # Hero section với gradient background & i18n
├── About.tsx               # Giới thiệu về EzyFix (i18n)
├── AISection.tsx           # Công nghệ AI matching (i18n)
├── BenefitsCustomer.tsx    # Quyền lợi khách hàng (i18n)
├── BenefitsTechnician.tsx  # Quyền lợi thợ sửa chữa (i18n)
├── HowItWorks.tsx          # Quy trình 3 bước (i18n)
├── Contact.tsx             # Form liên hệ & Download app (i18n)
├── Footer.tsx              # Footer với thông tin liên hệ (i18n)
├── FloatingButtons.tsx     # Nút Facebook & Scroll to Top
├── StaticNavbar.tsx        # Navbar tĩnh (không scroll animation)
├── RotatingEarth.tsx       # 3D Earth animation component
├── RotatingEarthSimple.tsx # Simple Earth animation
└── FloatingParticles.tsx   # Background particles effect
```

## � Hỗ trợ đa ngôn ngữ (i18n)

### Ngôn ngữ hỗ trợ
- 🇻🇳 **Tiếng Việt** (mặc định)
- 🇬🇧 **English**

### Translation Files
```
src/locales/
├── vi.json    # Tiếng Việt (60+ keys)
└── en.json    # English (60+ keys)
```

### Components đã được dịch
✅ **Navbar** - Navigation menu, dropdowns, language selector
✅ **Hero** - Headlines, CTAs, stats
✅ **About** - Section title, description, 3 features
✅ **AISection** - AI features descriptions
✅ **BenefitsCustomer** - 6 benefits với titles & descriptions
✅ **BenefitsTechnician** - 6 benefits với titles & descriptions
✅ **HowItWorks** - 3 steps process
✅ **Contact** - Form labels, download section, features
✅ **Footer** - Company info, links, contact details

### Language Selector
- **Desktop**: Flag icon + language code trong navbar
- **Mobile**: Dropdown menu với flag icons
- **Flags**:
  - 🇻🇳 Vietnam flag (vn.jpg)
  - 🇬🇧 UK flag (gb.png)
- **Smooth transitions**: Language switch với page refresh

## 🎯 Tính năng

### ✨ Navbar (Đã cập nhật)
- **Scroll Animation**: Navbar trong suốt → màu trắng khi scroll
- **Responsive**: Hamburger menu trên mobile
- **Sticky Position**: Luôn ở top của page với backdrop blur
- **Navigation Links**:
  - ~~Về chúng tôi~~ (đã xóa)
  - Khách hàng (dropdown: Quyền lợi, Quy tắc)
  - Thợ sửa chữa (dropdown: Quyền lợi, Quy tắc)
- **CTA Button**: "Tải ứng dụng" với gradient styling
- **Language Selector**:
  - Hiển thị cờ quốc gia (24x16px)
  - Dropdown menu với hover effects
  - Chỉ 2 ngôn ngữ: Việt & Anh
  - Smooth animations với `duration-500`
- **Dropdown Menus**:
  - Animated với fade-in effects
  - Click outside to close
  - Hover gradient effects
- **Mobile Optimization**: Collapsible menu với smooth transitions

### 🚀 Hero Section (Đã cập nhật với i18n)
- **Gradient Background**: Soft gradient #FFFFFF → #E0F2FE → #93C5FD
- **Animated Elements**: Pulse effects, fade-in animations
- **Slogan**: "App trên tay - Thợ tới ngay" (Translated)
- **CTA Buttons**:
  - "Đặt dịch vụ ngay" / "Book Service Now"
  - "Tìm hiểu thêm" / "Learn More"
- **Stats Display**:
  - 10,000+ thợ (Translated)
  - 50,000+ khách hàng (Translated)
  - 4.8★ rating (Translated)
- **Rotating Earth**: 3D animated globe với particles
- **Scroll Indicator**: Animated bounce arrow
- **Responsive**: Single column layout với optimized spacing

### 📖 About Section (Đã cập nhật với i18n)
- **Company Info**: Giới thiệu ngắn gọn về EzyFix (Translated)
- **3 Key Features** (All translated):
  - ⚡ Nhanh chóng / Fast & Efficient
  - 🛡️ Tin cậy / Reliable & Trusted
  - 💎 Minh bạch / Transparent Pricing
- **Intersection Observer**: Fade-in khi scroll tới
- **Hover Effects**: Card elevation với shadow-xl
- **Staggered Animation**: Delayed fade-in cho từng card (100ms/200ms/300ms)
- **Gradient Cards**: Blue gradient backgrounds với rounded corners

### 🤖 AI Section (Đã cập nhật với i18n)
- **Two Column Layout**: Content + Illustration
- **AI Features** (All translated):
  - 📍 Vị trí địa lý / Location-based matching
  - ⭐ Đánh giá & kinh nghiệm / Ratings & Experience
  - 💰 Giá cả phù hợp / Fair pricing
  - 🎯 Chuyên môn phù hợp / Expertise matching
- **Animated Icons**: Floating elements với pulse animation
- **Gradient Icons**: Circular gradient backgrounds
- **Responsive**: Stacks vertically on mobile
- **Hover Effects**: Scale và shadow transitions

### 👥 Benefits Sections (Đã cập nhật với i18n)

#### BenefitsCustomer (6 benefits - All translated)
- ⚡ Tìm thợ nhanh chóng / Find Technicians Quickly
- 💎 Chất lượng đảm bảo / Quality Guaranteed
- 💵 Giá cả minh bạch / Transparent Pricing
- ⭐ Đánh giá công khai / Public Reviews
- 🔒 Thanh toán an toàn / Secure Payment
- 📞 Hỗ trợ tận tâm / Dedicated Support
- **CTA Button**: "Đặt dịch vụ ngay" / "Book Service Now"
- **Grid Layout**: 3 columns desktop → 2 tablet → 1 mobile
- **Animated Cards**: Staggered fade-in với hover effects

#### BenefitsTechnician (6 benefits - All translated)
- 💼 Tự do nhận việc / Flexible Job Acceptance
- 💰 Thu nhập minh bạch / Transparent Income
- 📈 Tăng thu nhập / Increase Revenue
- 🎓 Đào tạo miễn phí / Free Training
- 🛡️ Bảo hiểm nghề nghiệp / Professional Insurance
- 🎯 Hỗ trợ 24/7 / 24/7 Support
- **CTA Button**: "Đăng ký làm thợ ngay" / "Register as Technician Now"
- **Same styling**: Consistent với BenefitsCustomer

### 🔄 How It Works (Đã cập nhật với i18n)
- **3 Steps Process** (All translated):
  1. 📱 Đặt dịch vụ / Book Service
  2. 🔧 Thợ tới sửa / Technician Arrives
  3. ✅ Hoàn thành & Thanh toán / Complete & Pay
- **Visual Timeline**:
  - Horizontal với gradient line (desktop)
  - Vertical layout (mobile)
- **Gradient Circles**: Large 32x32 circles với numbers
- **Icon Animations**: Scale on hover, shine effects
- **Responsive**: Adaptive layout for all screen sizes
- **Hover Effects**: Card lift (-translate-y-2) với color transitions

### 📞 Contact Section (Đã cập nhật với i18n)
- **Dual Layout**:
  - **Download App Card** (Translated):
    - Title & description
    - Google Play button với prefix text
    - 3 features: Miễn phí / Dễ sử dụng / An toàn
  - **Contact Form** (All labels translated):
    - Name / Họ và tên
    - Email
    - Phone / Số điện thoại
    - Message / Nội dung
    - Submit / Gửi tin nhắn
- **Form Validation**: Required fields
- **Gradient Cards**: Professional styling với shadows
- **Responsive Grid**: 2 columns → 1 column on mobile
- **CH Play Icon**: SVG gradient icon với hover effects

### 🔗 Footer (Đã cập nhật với i18n)
- **Company Info** (Translated):
  - Logo với gradient "Fix"
  - Description / Mô tả công ty
  - Slogan: "App trên tay - Thợ tới ngay"
- **Quick Links** (Translated):
  - About / Về chúng tôi
  - Customer / Khách hàng
  - Technician / Thợ sửa chữa
- **Contact Details** (Translated):
  - Email: info@ezyfix.com
  - Phone: 1900 xxxx
  - Location: TP. Hồ Chí Minh, Việt Nam
- **Social Media**: Facebook, Zalo, YouTube với hover effects
- **Copyright**: Dynamic year với gradient link
- **Dark Theme**: Gray-900 background với white text

### 🎈 FloatingButtons (Đã cập nhật với smooth animations)
- **Facebook Button**:
  - Fixed position (bottom-right)
  - Gradient circular button
  - Facebook icon với hover scale
  - Link to Facebook page
  - **Dynamic positioning**: Di chuyển xuống khi scroll button ẩn
  - Smooth transition với `duration-500` & `translate-y-[72px]`
- **Scroll to Top Button**:
  - Xuất hiện khi scroll > 300px
  - **Smooth fade-in/out**: `opacity-0/100` với `duration-500`
  - **Slide animation**: `translate-y-16` → `translate-y-0`
  - Up arrow icon với hover bounce (-translate-y-1)
  - `pointer-events-none` khi ẩn
  - Gradient background với shadow-lg
- **Coordinated animations**: Cả 2 nút di chuyển mượt mà và đồng bộ
- **z-index**: 50 để luôn ở trên các elements khác

<!-- ## 🎨 Design System

### Colors
```css
/* Primary Gradient */
from-[#609CEF] to-[#3D7CE0]
from-[#C3EAFA] to-[#5E9BEF]

/* Hero Background */
from-[#FFFFFF] via-[#E0F2FE] to-[#93C5FD]

/* Background Colors */
bg-gray-50    /* Light sections */
bg-blue-50    /* Gradient cards */
bg-white      /* Pure white cards */
bg-gray-900   /* Footer dark */

/* Text Colors */
text-gray-900 /* Headings - primary */
text-gray-600 /* Body text - secondary */
text-gray-400 /* Muted text */
text-white    /* On dark backgrounds */
```

### Typography
```css
/* Hero Headings */
text-5xl md:text-6xl lg:text-7xl font-extrabold

/* Section Headings */
text-4xl md:text-5xl font-extrabold

/* Subsection Headings */
text-2xl md:text-3xl font-bold

/* Card Titles */
text-xl md:text-2xl font-bold

/* Body Text */
text-lg md:text-xl     /* Subtitles */
text-base              /* Regular paragraphs */
text-sm                /* Small text, form labels */
```

### Spacing
```css
/* Section Padding */
py-20 md:py-32      /* Vertical padding - large sections */
py-12 md:py-20      /* Vertical padding - medium sections */
py-8 md:py-12       /* Vertical padding - small sections */

/* Container */
max-w-7xl           /* Maximum container width */
px-4 sm:px-6 lg:px-8  /* Horizontal padding responsive */

/* Grid Gaps */
gap-8               /* Standard grid gap */
gap-4               /* Compact grid gap */
space-y-4           /* Vertical spacing */
```

### Animations & Transitions
```css
/* Fade In (Intersection Observer) */
transition-all duration-1000
translate-y-0 opacity-100   /* Visible state */
translate-y-10 opacity-0    /* Hidden state */

/* Hover Effects */
hover:scale-105       /* Scale up slightly */
hover:scale-110       /* Scale up more */
hover:-translate-y-2  /* Lift up */
hover:shadow-xl       /* Enhanced shadow */
hover:shadow-2xl      /* Maximum shadow */

/* Smooth Transitions */
transition-all duration-300   /* Fast interactions */
transition-all duration-500   /* Medium animations */
transition-all duration-700   /* Slower, dramatic */

/* Staggered Delays */
style={{ transitionDelay: '100ms' }}  /* First item */
style={{ transitionDelay: '200ms' }}  /* Second item */
style={{ transitionDelay: '300ms' }}  /* Third item */

/* Gradient Animations */
animate-pulse         /* Breathing effect */
animate-bounce        /* Bounce effect */

/* Custom Animations */
.group-hover:scale-110      /* Child scale on parent hover */
.group-hover:-translate-y-1 /* Child lift on parent hover */
```

### Shadows
```css
shadow-lg     /* Standard card shadow */
shadow-xl     /* Enhanced elevation */
shadow-2xl    /* Maximum elevation */
hover:shadow-xl  /* Hover state enhancement */
```

### Border Radius
```css
rounded-lg     /* Standard rounded corners (8px) */
rounded-xl     /* Large rounded corners (12px) */
rounded-2xl    /* Extra large rounded (16px) */
rounded-full   /* Perfect circles (buttons, icons) */ -->
```

## 🚀 Cách sử dụng

### 1. Access Landing Page
```bash
# Development
npm run dev

# Access at
http://localhost:3001
# hoặc
http://localhost:3001/vi
http://localhost:3001/en
```

### 2. Component Usage
```tsx
// Import full landing page
import LandingPage from '@/app/[locale]/page';

// Import utilities
import FloatingButtons from '@/components/FloatingButtons';

// Import individual components
import {
  About,
  AISection,
  BenefitsCustomer,
  BenefitsTechnician,
  Contact,
  Footer,
  Hero,
  HowItWorks,
  Navbar
} from '@/components/landing';
```

### 3. Translation Usage
```tsx
// In any component
import { useTranslations } from 'next-intl';

const MyComponent = () => {
  const t = useTranslations('ComponentName');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};
```

### 4. Adding New Translations
```json
// src/locales/vi.json
{
  "ComponentName": {
    "title": "Tiêu đề tiếng Việt",
    "description": "Mô tả tiếng Việt"
  }
}

// src/locales/en.json
// {
//   "ComponentName": {
//     "title": "English Title",
//     "description": "English Description"
//   }
// }
```

### 5. Customization

#### Update Colors
Tìm và thay thế trong tất cả files:
- `from-[#609CEF] to-[#3D7CE0]` → Your gradient
- `from-[#C3EAFA] to-[#5E9BEF]` → Your secondary gradient
- `bg-gray-900` → Your dark color

#### Update Content
Chỉnh sửa translation files:
- `src/locales/vi.json` - Vietnamese content
- `src/locales/en.json` - English content

#### Add/Remove Sections
File `src/app/[locale]/page.tsx`:
```tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <AISection />
      <BenefitsCustomer />
      <BenefitsTechnician />
      <HowItWorks />
      <Contact />
      <Footer />
      {/* Add new sections here */}
      <FloatingButtons />
    </div>
  );
}
```

#### Customize Navbar Links
File `src/components/landing/Navbar.tsx`:
```tsx
const navLinks = [
  {
    href: '#customer',
    label: t('customer'),
    hasDropdown: true,
    submenu: [
      { href: '/benefits/customer', label: t('benefits'), isPage: true },
      { href: '/rules/customer', label: t('rules'), isPage: true },
    ],
  },
  // Add more links here
];
```

## 📱 Responsive Breakpoints

```
/* Tailwind CSS Breakpoints */
Mobile (default): < 640px
sm (Small):       640px   (Tablets portrait)
md (Medium):      768px   (Tablets landscape)
lg (Large):       1024px  (Desktops)
xl (Extra Large): 1280px  (Large desktops)
2xl:              1536px  (Extra large screens)
```

## ✨ Best Practices

### Performance
- ✅ Intersection Observer cho lazy animations
- ✅ Native CSS transitions (GPU accelerated)
- ✅ Next.js Image component cho flag images (24x16px)
- ✅ Minimal JavaScript - CSS-first animations
- ✅ Tree-shaking với named exports
- ✅ Lazy loading với dynamic imports (có thể)
- ✅ Optimized bundle size với next-intl

### Accessibility
- ✅ Semantic HTML elements (section, nav, footer, etc.)
- ✅ ARIA labels cho interactive elements
- ✅ Focus states cho buttons và links
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Alt texts for images (flag images)
- ✅ Keyboard navigation support
- ✅ Color contrast ratios (WCAG AA compliant)

### SEO
- ✅ Semantic HTML structure
- ✅ Proper meta tags (trong layout)
- ✅ Multi-language support với hreflang
- ✅ Descriptive anchor texts
- ✅ Schema markup ready
- ✅ Fast loading times
- ✅ Mobile-first responsive design

### Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Consistent naming conventions
- ✅ Component separation
- ✅ Reusable utility classes
- ✅ No hardcoded text (all i18n)
- ✅ Clean code structure

## 🔄 Recent Updates & Improvements

### Version 2.0 (Latest)
✅ **Full i18n Integration**
- Added Vietnamese & English translations
- 60+ translation keys across 9 components
- Flag-based language selector với smooth transitions
- Removed French (kept only 2 languages)

✅ **Navbar Enhancements**
- Removed "About" section
- Flag icons thay vì globe icon
- Smooth dropdown animations
- Mobile-optimized language selector
- Dynamic positioning với scroll

✅ **FloatingButtons Improvements**
- Smooth fade-in/slide-up animation (duration-500)
- Coordinated Facebook button movement
- Facebook button di chuyển xuống khi scroll button ẩn
- No blank space when scroll button hidden
- Enhanced hover effects

✅ **Translation System**
- All components fully translated
- Consistent translation keys
- Easy to add new languages
- Translation files organized by component

✅ **Design Polish**
- Consistent spacing và typography
- Improved gradient usage
- Better hover states
- Enhanced shadow effects
- Optimized responsive layouts

## 🔄 Future Enhancements

### Phase 1 - Content Enhancement
- [ ] Add third language (optional: French/Chinese)
- [ ] Add customer testimonials section
- [ ] Add FAQ accordion section
- [ ] Add pricing plans comparison
- [ ] Add blog/news section preview

### Phase 2 - Functionality
- [ ] Contact form backend integration
- [ ] Newsletter subscription với API
- [ ] Live chat widget integration
- [ ] WhatsApp/Zalo direct contact buttons
- [ ] Video testimonials autoplay section
- [ ] Interactive service calculator

### Phase 3 - Advanced Features
- [ ] Analytics integration (Google Analytics 4)
- [ ] A/B testing setup với PostHog
- [ ] Performance monitoring với Sentry
- [ ] Advanced SEO optimization
- [ ] PWA features (offline support)
- [ ] Push notifications
- [ ] User preference persistence (language, theme)

### Phase 4 - Marketing Integration
- [ ] Facebook Pixel integration
- [ ] Google Ads conversion tracking
- [ ] Referral program tracking
- [ ] Promo code system
- [ ] Email marketing integration
- [ ] CRM integration (HubSpot/Salesforce)

## 📝 Notes

### Translation Files
- `src/locales/vi.json` - Vietnamese (default locale)
- `src/locales/en.json` - English
- Each component has dedicated namespace
- 60+ translation keys total
- Easy to extend with new keys

### Flag Images
- Located in `public/assets/images/flags/`
- Vietnam: `vn.jpg` (24x16px)
- United Kingdom: `gb.png` (24x16px)
- Optimized for web với `object-cover`

### TypeScript
Tất cả components đều typed với TypeScript strict mode. Một số temporary errors trong development là normal và sẽ tự động resolve khi build.

### Next.js App Router
Landing page sử dụng Next.js 15 App Router với:
- Server Components (default)
- Client Components ('use client' directive)
- Middleware cho i18n routing
- Optimized bundling

### Tailwind CSS
- JIT compiler cho optimal performance
- Custom colors trong theme
- Utility-first approach
- Responsive breakpoints
- Dark mode ready (có thể enable)

## 🎯 Testing Checklist

### Responsive Design
- [x] Desktop 1920px+ (Full HD)
- [x] Laptop 1366px (Standard laptop)
- [x] Tablet landscape 1024px (iPad Pro)
- [x] Tablet portrait 768px (iPad)
- [x] Mobile 414px (iPhone Plus)
- [x] Mobile 375px (iPhone X)
- [x] Mobile 320px (iPhone SE)

### Functionality
- [x] Navbar scroll behavior
- [x] Navbar dropdowns (hover & click)
- [x] Language switching (vi/en)
- [x] All internal links working
- [x] External links (Facebook, CH Play)
- [x] Scroll to top button
- [x] Facebook floating button
- [x] Form validation (Contact)
- [x] Smooth scroll animations
- [x] Intersection Observer animations

### Cross-browser
- [x] Chrome/Edge (Chromium)
- [x] Firefox
- [x] Safari (macOS/iOS)
- [x] Mobile browsers (Chrome/Safari)

### Performance
- [x] Fast load times (< 3s)
- [x] Smooth animations (60fps)
- [x] No layout shifts
- [x] Optimized images
- [x] Lazy loading working

### i18n
- [x] Vietnamese translations complete
- [x] English translations complete
- [x] Language selector working
- [x] URL locale prefix working
- [x] No hardcoded text remaining
- [x] Consistent translations

## 🤝 Support & Maintenance

### Component Structure
```
Each component follows this pattern:
1. 'use client' directive (if needed)
2. Imports (React, next-intl, etc.)
3. Component definition
4. useTranslations hook
5. State management
6. Effects (useEffect)
7. Helper functions
8. JSX return
9. Export default
```

### Debugging Tips
- Check browser console for errors
- Verify translation keys exist in JSON files
- Test on multiple screen sizes
- Use React DevTools for component inspection
- Check Network tab for image loading

### Common Issues
**Issue**: Translations not showing
**Fix**: Verify key exists in both vi.json and en.json

**Issue**: Language not switching
**Fix**: Check middleware.ts and routing configuration

**Issue**: Images not loading
**Fix**: Verify file path in public/assets/images/

**Issue**: Animations choppy
**Fix**: Check GPU acceleration, reduce complexity

### Getting Help
1. Check inline code comments
2. Read this comprehensive README
3. Review component source code
4. Test in isolation
5. Check Next.js and next-intl documentation

---

## 📊 Project Statistics

- **Total Components**: 14 (9 landing + 5 utility)
- **Lines of Code**: ~5,000+ lines
- **Translation Keys**: 60+ keys
- **Languages**: 2 (Vietnamese, English)
- **Sections**: 9 main sections
- **Responsive Breakpoints**: 5 sizes
- **Animation Types**: 10+ different effects

---

**Made with ❤️ for EzyFix**

*App trên tay - Thợ tới ngay* 🔧📱✨

**Version**: 2.0.0
**Last Updated**: December 2024
**Framework**: Next.js 15 + TypeScript + Tailwind CSS
**i18n**: next-intl
