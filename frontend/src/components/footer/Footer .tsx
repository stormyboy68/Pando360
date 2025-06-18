"use client";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-65 py-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* بخش خبرنامه */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">خبرنامه</h3>
            <p className="text-gray-300 mb-4">
              برای دریافت آخرین تخفیف‌ها و تعرفه‌ها در خبرنامه عضو شوید
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="آدرس ایمیل"
                className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
                عضویت
              </button>
            </div>
          </div>

          {/* بخش لینک‌های مفید */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">لینک‌های مفید</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition block">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition block">
                  خدمات
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition block">
                  تعرفه‌ها
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition block">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش تماس با ما */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">تماس با ما</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="ml-2">📧</span>
                <span>info@example.com</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">📞</span>
                <span>+98 21 1234 5678</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">📞</span>
                <span>+91 1 021 555 0000</span>
              </li>
            </ul>
          </div>

          {/* بخش درباره ما */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">درباره ما</h3>
            <p className="text-gray-300">
              ارائه دهنده خدمات پروکسی و VPN با کیفیت بالا و امنیت بی‌نظیر
            </p>
          </div>
        </div>

        {/* بخش کپی رایت */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p className="rtl">طراحی شده توسط Pando360 تمامی حقوق محفوظ است.  2025 ©</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-300 transition">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              شرایط استفاده
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};