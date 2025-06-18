📦 Pando360 – Fullstack Application (Laravel + Next.js)

این پروژه یک اپلیکیشن فول‌استک با بک‌اند Laravel و فرانت‌اند Next.js است که به صورت کامل با Docker کانتینری شده است. این پروژه به شما امکان می‌دهد تا با یک خط فرمان، اپلیکیشن را در سرور Ubuntu خود بالا بیاورید.

✨ شروع سریع (Quick Start)

پیش‌نیازها

قبل از اجرای پروژه، مطمئن شوید که موارد زیر روی سرور شما نصب نیستند یا مشکلی ندارند:

Ubuntu 20.04+ (تست‌شده)

دسترسی sudo

دسترسی به اینترنت برای نصب Docker و کلون پروژه

💡 دیپلوی با یک دستور

اسکریپت deploy_pando360.sh برای نصب Docker، فایروال، کلون کردن پروژه و اجرای Docker Compose طراحی شده است.

مراحل:


185.51.200.2 178.22.122.100
# 1. دریافت پروژه
sudo apt install -y git
git clone https://github.com/stormyboy68/Pando360.git
cd Pando360
# 2.ویرایش فایل .env  
    ایمیل و رمز و ... را وارد کنید
# 3. اجرای اسکریپت نصب و راه‌اندازی
chmod +x deploy_pando360.sh && sudo ./deploy_pando360.sh

🔐 پورت‌های مورد نیاز

Frontend (Next.js): http://localhost:3000

Backend (Laravel API via Nginx): http://localhost:8000


اسکریپت به صورت خودکار این پورت‌ها را در فایروال باز می‌کند.

🧪 اطلاعات بیشتر برای توسعه‌دهندگان

📁 ساختار پروژه

Pando360/
├── backend/         # سورس لاراول
├── frontend/        # سورس نکست جی‌اس
├── docker/          # کانفیگ‌های Nginx و Docker
├── .env             # فایل تنظیمات محیطی
├── docker-compose.yml
├── deploy_pando360.sh ✅
└── README.md

🤝 مشارکت (Contributing)

Pull requestها خوش‌آمدند. لطفاً قبل از هر گونه تغییر عمده، یک Issue باز کنید تا تغییراتتان بررسی شود.

📜 لایسنس

MIT License © stormyboy68