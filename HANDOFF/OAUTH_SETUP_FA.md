# راه‌اندازی ورود با Google و GitHub (v184)

کد سایت آماده است (دو دکمه در auth.html). تا مراحل زیر را در Supabase، Google و GitHub انجام ندهی، دکمه‌ها خطا می‌دهند. کلید محرمانه (Client Secret) را فقط در Supabase بنویس، نه در چت و نه در کد.

نشانی Supabase تو: `https://ttmkhuitmqfdfmtfiekv.supabase.co`
نشانی بازگشت (Callback) برای هر دو: `https://ttmkhuitmqfdfmtfiekv.supabase.co/auth/v1/callback`

## الف) Supabase: نشانی سایت
1. Authentication ← URL Configuration.
2. Site URL = نشانی سایت (الان `https://delicate-frost-e2d6.cinecode.workers.dev`، بعد از خرید دامنه عوضش کن).
3. در Redirect URLs اضافه کن: `https://delicate-frost-e2d6.cinecode.workers.dev/auth.html` (و همین برای دامنهٔ واقعی بعداً).

## ب) Google
1. console.cloud.google.com ← پروژهٔ تازه.
2. APIs & Services ← OAuth consent screen ← External ← نام برنامه CineCode Academy، ایمیل پشتیبانی amobariz383@gmail.com.
3. Credentials ← Create credentials ← OAuth client ID ← Web application.
4. در Authorized redirect URIs فقط نشانی Callback بالا را بگذار.
5. Client ID و Client Secret را کپی کن.
6. Supabase ← Authentication ← Sign In / Providers ← Google ← روشن ← هر دو را بچسبان ← Save.
7. در Google «Publish app» را بزن تا هر کسی بتواند وارد شود (در حالت Testing فقط ایمیل‌های آزمایشی می‌توانند).

## ج) GitHub
1. github.com ← Settings ← Developer settings ← OAuth Apps ← New OAuth App.
2. Homepage URL = نشانی سایت. Authorization callback URL = نشانی Callback بالا.
3. Client ID را کپی کن، Generate a new client secret را بزن و آن را هم کپی کن.
4. Supabase ← Providers ← GitHub ← روشن ← بچسبان ← Save.

## د) یک ایمیل = یک حساب
Supabase حساب‌هایی را که ایمیل تأییدشدهٔ یکسان دارند خودکار به هم وصل می‌کند (automatic linking)، پس با Google و GitHub و رمز با یک ایمیل همان یک حساب باز می‌شود. اگر قبلاً دو حساب جدا ساخته شده، یکی را در Authentication ← Users پاک کن.
در Authentication ← Sign In / Providers گزینهٔ «Allow manual linking» لازم نیست.

## هـ) آزمایش
1. پنجرهٔ ناشناس باز کن ← auth.html ← «ادامه با Google».
2. باید به account.html برسی و پروفایل ساخته شود. بعد خارج شو و با GitHub همان ایمیل را امتحان کن.
3. لغو کردن در صفحهٔ Google باید پیام «ورود لغو شد» بدهد.
4. اگر GitHub ایمیلت را پنهان کرده، در GitHub ← Settings ← Emails ایمیل عمومی/اصلی را تأیید کن.
