"use client";

import { useEffect, useState } from "react";
// import { XMarkIcon } from '@heroicons/react/24/outline';

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number; // مدت زمان نمایش به میلی‌ثانیه
  onClose?: () => void;
};

export default function ToastNotification({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);



  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 30);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration,handleClose]);
  if (!isVisible) return null;

  // رنگ‌های مختلف برای انواع پیام
  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`fixed top-20 right-4 border-l-4 rounded-lg p-4 shadow-lg max-w-xs ${
        typeStyles[type]
      } ${
        isExiting
          ? "animate-[fadeOutRight_0.3s_ease-in-out_forwards]"
          : "animate-[fadeInRight_0.3s_ease-in-out]"
      }`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-right rtl">{message}</p>
        <button
          onClick={handleClose}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
