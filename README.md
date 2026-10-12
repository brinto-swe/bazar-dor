# বাজার দর (Bazar Dor)

বাজার দর বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ মূল্য দেখার একটি responsive web application। এখানে চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলাসহ বিভিন্ন পণ্যের বর্তমান দাম, মূল্য পরিবর্তন এবং বাজারভিত্তিক তুলনা দেখা যায়।

## Project Links
- Live app: https://bazar-dor-a7-brinto-swe.netlify.app/
- GitHub repository: https://github.com/brinto-swe/bazar-dor

## Project overview

Application-এর home page-এ আজ দাম বেড়েছে, দাম কমেছে এবং সব পণ্যের তালিকা দেখানো হয়। Category page থেকে নির্দিষ্ট বিভাগের পণ্য দেখা ও দাম অনুযায়ী sort করা যায়। ব্যবহারকারী account তৈরি বা sign in করার পর product details এবং নিজের profile page ব্যবহার করতে পারেন।

Product details page-এ একটি পণ্যের:

- আজকের দাম
- গতকাল, গত সপ্তাহ ও গত মাসের দাম
- সর্বনিম্ন, সর্বোচ্চ ও গড় দাম
- বিভিন্ন বাজার ও বিভাগের মূল্যতালিকা

দেখানো হয়।

## Features

- বাংলা ও responsive user interface
- সব পণ্যের বর্তমান বাজারদর
- দাম বৃদ্ধি ও হ্রাস পাওয়া পণ্যের আলাদা section
- Category অনুযায়ী product filtering
- দাম অনুযায়ী ascending ও descending sorting
- চলমান market-price marquee
- বিস্তারিত market comparison table
- Email ও password দিয়ে account তৈরি এবং sign in
- Google ও GitHub social authentication
- MongoDB-ভিত্তিক user ও session persistence
- Protected product details এবং profile page
- Profile name update
- Loading state ও toast notification

## Technologies

| Technology | ব্যবহার |
| --- | --- |
| Next.js 16 | App Router, server rendering, routing ও proxy |
| React 19 | Component-based user interface |
| Tailwind CSS 4 | Styling ও responsive layout |
| daisyUI 5 | UI components |
| Better Auth | Authentication ও session management |
| MongoDB Atlas | User, account ও session storage |
| React Hot Toast | Success ও error notification |
| React Icons | Interface icons |
| React Marquee Text | Market-price marquee |

## Pages and routes

| Route | Access | বিবরণ |
| --- | --- | --- |
| `/` | Public | Home page ও সব products |
| `/categories/[id]` | Public | Category products ও sorting |
| `/sign-in` | Public | User sign in |
| `/sign-up` | Public | নতুন account তৈরি |
| `/products/[id]` | Protected | Product details ও market prices |
| `/profile` | Protected | User profile দেখা ও update করা |
| `/api/auth/[...all]` | API | Better Auth endpoints |

`src/proxy.js` product details ও profile routes সুরক্ষিত রাখে। Protected page-এর server component-এ session আবার যাচাই করা হয়। Authentication না থাকলে ব্যবহারকারী sign-in page-এ redirect হন এবং sign-in শেষে আগের page-এ ফিরে যান।

## Authentication

Application-এ তিনভাবে authentication করা যায়:

1. Email ও password
2. Google OAuth
3. GitHub OAuth

Better Auth authentication, password hashing, session cookie এবং OAuth flow পরিচালনা করে। MongoDB Atlas-এর `bazar-dor` database-এ সাধারণত নিচের collections তৈরি হয়:

- `user`
- `account`
- `session`
- `verification`

## Product data API

Product ও category data নিচের API থেকে নেওয়া হয়:

```text
https://api.abcz.workers.dev/api/bazardor
```

| Data | Endpoint |
| --- | --- |
| সব categories | `/categories` |
| একটি category | `/categories/{id}` |
| সব products | `/products` |
| Category products | `/products?category={id}` |
| একটি product | `/products/{id}` |

## Environment variables

Project root-এ `.env` file-এ নিচের variables প্রয়োজন:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=
BETTER_AUTH_DB_NAME=bazar-dor
BETTER_AUTH_GOOGLE_CLIENT_ID=
BETTER_AUTH_GOOGLE_SECRET=
BETTER_AUTH_GITHUB_CLIENT_ID=
BETTER_AUTH_GITHUB_CLIENT_SECRET=
```

`.env` file repository-তে commit করা যাবে না।

## Run locally

```bash
npm install
npm run dev
```

Application চালু হবে:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## OAuth callback URLs

Local development:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

Production:

```text
https://your-domain.com/api/auth/callback/google
https://your-domain.com/api/auth/callback/github
```

## Deployment

Projectটি Netlify-তে deploy করা যায়। Netlify project-এ repository connect করে environment variables যোগ করতে হবে। Production-এ `BETTER_AUTH_URL` হিসেবে deployed site URL ব্যবহার করতে হবে।

```text
Build command: npm run build
Publish directory: .next
```

GitHub repository-এর `main` branch-এ নতুন commit push করলে connected Netlify site স্বয়ংক্রিয়ভাবে redeploy হবে।

## Project purpose

এই project-এর উদ্দেশ্য হলো Next.js App Router ব্যবহার করে external API data, responsive UI, MongoDB persistence এবং একটি পূর্ণ authentication system সমন্বিত বাস্তবধর্মী application তৈরি করা।
