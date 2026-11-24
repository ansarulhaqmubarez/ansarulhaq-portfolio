# حل خطای «Error sending confirmation email» و «یک ایمیل = یک حساب»

یادآوری: من به Supabase تو دسترسی ندارم. اسم منوها ممکن است کمی فرق کند. رمز و کلیدها را فقط در Supabase وارد کن، نه در چت.

## الف) چرا خطا می‌دهد؟
ایمیل داخلی Supabase فقط چند ایمیل در ساعت می‌فرستد و گاهی کار نمی‌کند. راه درست: SMTP خودت.

## ب) وصل کردن Brevo (رایگان)
1. در brevo.com حساب بساز.
2. در Brevo: بالا سمت راست نام تو ← SMTP & API ← تب SMTP ← «Generate a new SMTP key». کلید را کپی کن.
3. در Brevo: Senders, Domains ← Senders ← ایمیل `ansarulhaq.af@gmail.com` را اضافه و تأیید کن (ایمیل تأیید می‌آید).
4. در Supabase: Authentication ← Emails ← SMTP Settings ← روشن کن.
5. بنویس: Host = `smtp-relay.brevo.com` ، Port = `587` ، Username = ایمیل حساب Brevo ، Password = همان SMTP key (نه رمز ورود). Sender email = `ansarulhaq.af@gmail.com` ، Sender name = `CineCode Academy`.
6. ذخیره کن و یک ثبت‌نام آزمایشی با ایمیل تازه بزن.
(رمز اپلیکیشن Gmail که قبلاً در چت گذاشتی را در Google عوض کن، چون در چت دیده شد.)

## ج) یک ایمیل = یک حساب
1. Supabase ← Authentication ← Sign In / Providers ← Email.
2. «Confirm email» را **روشن** بگذار. بدون آن، هر ایمیلی (حتی غلط) حساب می‌سازد.
3. Supabase خودش نمی‌گذارد یک ایمیل دوبار ثبت شود. اگر با یک ایمیل «دوباره حساب شد»، احتمالاً حساب قبلی هنوز تأییدنشده بود: Authentication ← Users را باز کن و حساب تکراری/تأییدنشده را حذف کن.

## د) قالب‌ها
Authentication ← Emails ← Templates ← «Confirm signup» (و دو تای دیگر) ← محتوای `1-confirm-signup.html` را بچسبان و عنوان را از `.subject.txt` بگذار.
