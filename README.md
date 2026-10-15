# Senior Developer 3D Portfolio

Website Portfolio 3D tương tác chất lượng cao dành cho Senior Developer.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (Strict)
- **Styling:** Tailwind CSS + CSS Variables (Dark/Light mode via next-themes)
- **3D & Visuals:** Three.js + React Three Fiber + Drei
- **Animation:** GSAP ScrollTrigger + Lenis + Framer Motion
- **Content:** MDX case studies + Zod validation schemas
- **Form & Email:** React Hook Form + Zod + Resend API + Rate limiting & Honeypot
- **Testing:** Vitest + React Testing Library

## Yêu cầu môi trường
- Node.js >= 20
- npm >= 10

## Cài đặt & Chạy Local
```bash
# Cài đặt dependencies
npm install --legacy-peer-deps

# Khởi chạy dev server
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Các lệnh thường dùng
```bash
npm run dev        # Chạy máy chủ phát triển
npm run build      # Build cho production
npm run lint       # Kiểm tra ESLint
npm run typecheck  # Kiểm tra kiểu dữ liệu TypeScript
npm run test       # Chạy unit test với Vitest
npm run format     # Format code với Prettier
```

## Cấu trúc thư mục
```
├── app/                  # Next.js App Router (pages, layout, api)
├── components/
│   ├── ui/               # UI Primitives (Button, Card, Badge, SectionTitle...)
│   ├── sections/         # Hero, About, Skills, Experience, Projects, Contact...
│   ├── three/            # 3D Canvas, HeroScene, Particles, Fallback
│   ├── motion/           # Reveal animations, smooth scroll
│   └── providers/        # ThemeProvider, SmoothScrollProvider
├── content/
│   └── projects/         # MDX case studies
├── data/                 # Dữ liệu tĩnh (profile, experience, skills, testimonials)
├── lib/                  # Utilities (env, date, projects, seo, rate-limit)
└── types/                # Zod schemas & TypeScript types
```

## Tuỳ chỉnh nội dung
Toàn bộ thông tin cá nhân và dự án được tách biệt khỏi UI:
- Chỉnh sửa thông tin cá nhân tại `data/profile.ts`
- Chỉnh sửa kinh nghiệm làm việc tại `data/experience.ts`
- Chỉnh sửa kỹ năng tại `data/skills.ts`
- Thêm hoặc sửa case study dự án bằng các file MDX trong `content/projects/`
