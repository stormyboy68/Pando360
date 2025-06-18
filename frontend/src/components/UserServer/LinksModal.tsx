"use client";
import { useState } from "react";
import {QRCodeSVG} from 'qrcode.react';
import { CopyIcon, CheckIcon } from "./icons"; // آیکون‌های جدید

interface LinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: string[];
  subscriptionUrl: string;
  serverUrl: string;
}

export const LinksModal = ({
  isOpen,
  onClose,
  links,
  subscriptionUrl,
  serverUrl,
}: LinksModalProps) => {
  const [copiedItems, setCopiedItems] = useState<{[key: string]: boolean}>({});

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => ({...prev, [key]: true}));
    setTimeout(() => setCopiedItems(prev => ({...prev, [key]: false})), 2000);
  };

  if (!isOpen) return null;

  const fullSubscriptionUrl = `${serverUrl}${subscriptionUrl}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">لینک‌های اتصال</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {/* Subscription Link - Row Style */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1">لینک اشتراک</p>
                <p className="text-sm truncate">{fullSubscriptionUrl}</p>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <div className="w-32 h-32 flex items-center justify-center">
                  <QRCodeSVG 
                    value={fullSubscriptionUrl} 
                    size={200} 
                    level="H"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(fullSubscriptionUrl, 'subscription')}
                  className="p-1 text-blue-500 hover:text-blue-700 relative"
                >
                  {copiedItems['subscription'] ? (
                    <span className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-500 mr-1">کپی شد</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CopyIcon className="w-4 h-4" />
                      <span className="text-xs mr-1">کپی</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Individual Links - Row Style */}
            {links.map((link, index) => {
              const type = link.startsWith("vmess") ? "VMess" : 
                         link.startsWith("ss") ? "Shadowsocks" : 
                         link.startsWith("vless") ? "VLESS" : "Trojan";
              const key = `link-${index}`;

              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">لینک {type}</p>
                    <p className="text-sm truncate">{link}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <div className="w-32 h-32 flex items-center justify-center">
                      <QRCodeSVG 
                        value={link} 
                        size={200} 
                        level="H"
                      />
                    </div>
                    <button
                      onClick={() => copyToClipboard(link, key)}
                      className="p-1 text-blue-500 hover:text-blue-700 relative"
                    >
                      {copiedItems[key] ? (
                        <span className="flex items-center">
                          <CheckIcon className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500 mr-1">کپی شد</span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CopyIcon className="w-4 h-4" />
                          <span className="text-xs mr-1">کپی</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};