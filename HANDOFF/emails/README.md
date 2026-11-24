# قالب‌های ایمیل CineCode Academy

## ۱) سه قالب مخصوص Supabase (کار می‌کنند)
- `1-confirm-signup.html` ← تأیید ایمیل ثبت‌نام
- `2-reset-password.html` ← بازیابی رمز
- `3-magic-link.html` ← لینک جادویی
هر کدام یک فایل `.subject.txt` دارد (عنوان ایمیل).
جای چسباندن: Supabase ← Authentication ← Emails ← Templates.

## ۲) دو قالب برای رویدادها (آمادهٔ طراحی؛ ارسال خودکار هنوز وصل نیست)
- `4-course-enrolled.html` ← بعد از ثبت‌نام در دوره
- `5-certificate-issued.html` ← بعد از گرفتن گواهی
متغیرها: `{{name}} {{course_title}} {{lessons_count}} {{course_url}} {{certificate_code}} {{certificate_url}} {{issued_date}} {{site_url}}`.
Supabase خودش فقط ایمیل‌های ورود را می‌فرستد؛ برای این دو، یک سرویس ایمیل (Brevo/Resend) و یک تابع سرور لازم است. این بخش هنوز ساخته نشده (در QUEUE_NEXT.md).
