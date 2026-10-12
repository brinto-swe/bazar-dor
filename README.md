# বাজার দর

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর দেখার responsive Next.js application।

## Local setup

`.env`-এ নিচের variables দিন:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=mongodb+srv://...
BETTER_AUTH_DB_NAME=bazar-dor
BETTER_AUTH_GOOGLE_CLIENT_ID=
BETTER_AUTH_GOOGLE_SECRET=
BETTER_AUTH_GITHUB_CLIENT_ID=
BETTER_AUTH_GITHUB_CLIENT_SECRET=
```

তারপর চালান:

```bash
npm install
npm run dev
```

## OAuth callback URLs

- Local Google: `http://localhost:3000/api/auth/callback/google`
- Local GitHub: `http://localhost:3000/api/auth/callback/github`
- Production Google: `https://your-domain.com/api/auth/callback/google`
- Production GitHub: `https://your-domain.com/api/auth/callback/github`

Production host-এ `.env` file upload না করে hosting dashboard-এ একই environment variables যোগ করতে হবে।

## MongoDB collections

Better Auth data MongoDB Atlas-এর `bazar-dor` database-এ লেখা হয়। Atlas-এ **Browse Collections → bazar-dor** খুললে `user`, `account`, `session` collections দেখা যাবে। **Database Access → Database Users** শুধু MongoDB connection credentials দেখায়; application users সেখানে দেখা যায় না।

## Checks

```bash
npm run lint
npm run build
```
