"use client";
import { GetWT } from "@/Rotuer/RouteOutWTClient";
import { type FC, useState, useEffect, useMemo } from "react";
import { ISelectOption, SearchableSelect } from "../etc/SearchableSelect";
import { useAppSelector } from "@/store/hooks";
import { User } from "@/types/user";
import { IUserServer } from "./UserServerList";

interface IProxyAndInbound {
  inbounds: {
    trojan?: string[];
    vmess?: string[];
    vless?: string[];
    shadowsocks?: string[];
  };
  proxies: {
    trojan?: { id: string };
    vmess?: { id: string };
    vless?: { id: string };
    shadowsocks?: { id: string };
  };
}

interface CreateUserModalProps {
  isOpen: boolean;
  optionsServer: ISelectOption[];
  onClose: () => void;
  onCreate: (
    userData: Partial<IUserServer>,
    serverId: string | number
  ) => Promise<void>;
}

export const CreateUserModal: FC<CreateUserModalProps> = ({
  isOpen,
  optionsServer,
  onClose,
  onCreate,
}) => {
  const user = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [serverId, setServerId] = useState<string | number>(0);
  const [proxyAndInbound, setProxyAndInbound] = useState<IProxyAndInbound>({
    inbounds: {},
    proxies: {},
  });
  const [error, setError] = useState<string | null>(null);
  const initialFormData = {
    username: "",
    user_id: user.userData?.id ,
    data_limit: "10",
    expire: "",
    inbounds: {
      vmess: [] as string[],
      vless: [] as string[],
      trojan: [] as string[],
      shadowsocks: [] as string[],
    },
    proxies: {
      vmess: { id: "" },
      vless: { id: "" },
      trojan: { id: "" },
      shadowsocks: { id: "" },
    },
    status: "active",
    note: "",
    data_limit_reset_strategy: "no_reset",
  };
  const [userlist, setUserList] = useState<
    | {
        value: string | number;
        label: string;
      }[]
    | []
  >([]);
  const [formData, setFormData] = useState<Partial<IUserServer>>(initialFormData);

  const getProxiesAndInbounds = async (serverId: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await GetWT(`/user-server/${serverId}/inbounds/proxies`);

      if (!response?.data) {
        throw new Error("Invalid server response");
      }

      setProxyAndInbound({
        inbounds: response.data.inbounds || {},
        proxies: response.data.proxies || {},
      });
    } catch (err) {
      console.error("Error fetching proxies and inbounds:", err);
      setError("خطا در دریافت اطلاعات پروتکل‌ها و پروکسی‌ها");
      setProxyAndInbound({ inbounds: {}, proxies: {} });
    } finally {
      setIsLoading(false);
    }
  };
  const getAllUsers = async () => {
    const response = await GetWT("/users");
    setUserList(
      response.data.map((user: User) => {
        return { value: user.id, label: user.email };
      })
    );
  };

  useEffect(() => {
    if (serverId) {
      getProxiesAndInbounds(serverId);
    }
  }, [serverId]);
  useEffect(() => {
    if (user.isSuperAdmin) {
      getAllUsers();
    }
  }, [user.isSuperAdmin]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen,initialFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeUserId = (selectedValue: string | number) => {
    const userId = Number(selectedValue);
    if (isNaN(userId)) {
      console.error("Invalid user_id:", selectedValue);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      user_id: userId,
    }));
  };

  const handleProtocolChange = (selectedProtocols: string[]) => {
    const newInbounds: any = {};
    const newProxies: any = {};

    selectedProtocols.forEach((protocol) => {
      if (
        proxyAndInbound.inbounds[
          protocol as keyof typeof proxyAndInbound.inbounds
        ]
      ) {
        newInbounds[protocol] =
          proxyAndInbound.inbounds[
            protocol as keyof typeof proxyAndInbound.inbounds
          ];
      }
      if (
        proxyAndInbound.proxies[
          protocol as keyof typeof proxyAndInbound.proxies
        ]?.id
      ) {
        newProxies[protocol] = {
          id:
            proxyAndInbound.proxies[
              protocol as keyof typeof proxyAndInbound.proxies
            ]?.id || "",
        };
      }
    });

    setFormData((prev) => ({
      ...prev,
      inbounds: newInbounds,
      proxies: newProxies,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onCreate(formData, serverId);
      onClose();
    } catch (err) {
      console.error("Error creating user:", err);
      setError("خطا در ایجاد کاربر");
    } finally {
      setIsLoading(false);
    }
  };

  const availableProtocols = useMemo(() => {
    return Object.entries(proxyAndInbound.inbounds)
      .filter(([_, value]) => value && value.length > 0)
      .map(([protocol]) => ({
        value: protocol,
        label: protocol.charAt(0).toUpperCase() + protocol.slice(1),
      }));
  }, [proxyAndInbound.inbounds]);

  const selectedProtocols = useMemo(() => {
    return Object.entries(formData.inbounds || {})
      .filter(([_, value]) => value && value.length > 0)
      .map(([protocol]) => protocol);
  }, [formData.inbounds]);

  const isFormValid = useMemo(() => {
    return (
      formData.username &&
      selectedProtocols.length > 0 &&
      Number(formData.user_id) > 0 &&
      !error
    );
  }, [formData, selectedProtocols, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">ساخت کاربر جدید</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">سرور *</label>
                <SearchableSelect
                  options={optionsServer}
                  value={serverId}
                  onChange={setServerId}
                  placeholder="یک سرور انتخاب کنید"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              {availableProtocols.length > 0 ? (
                <div>
                  <label className="block mb-1">پروتکل‌ها *</label>
                  <select
                    multiple
                    value={selectedProtocols}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      handleProtocolChange(selected);
                    }}
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  >
                    {availableProtocols.map((protocol) => (
                      <option key={protocol.value} value={protocol.value}>
                        {protocol.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    با نگه داشتن Ctrl می‌توانید چند پروتکل انتخاب کنید
                  </p>
                </div>
              ) : serverId ? (
                <div className="text-yellow-600 text-sm">
                  {isLoading ? "در حال دریافت..." : "پروتکل‌هایی یافت نشد"}
                </div>
              ) : null}
              <div>
                {user.isSuperAdmin ? (
                  <>
                    <label className="block mb-1">نماینده *</label>
                    <SearchableSelect
                      name="user_id"
                      value={formData.user_id}
                      options={userlist}
                      onChange={handleChangeUserId}
                      className="w-full p-2 border rounded"
                      placeholder="انتخاب نماینده"
                    />
                  </>
                ) : (
                  <input
                    type="hidden"
                    name="user_id"
                    value={user.userData?.id || 0}
                    onChange={handleChange}
                  />
                )}
              </div>
              <div>
                <label className="block mb-1">نام کاربری *</label>
                <input
                  type="text"
                  name="username"
                  autoComplete="new-username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-1">محدودیت داده (GB) *</label>
                <input
                  type="number"
                  name="data_limit"
                  value={formData.data_limit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  min="1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block mb-1">تاریخ انقضا *</label>
                <input
                  type="date"
                  name="expire"
                  value={formData.expire}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded"
                  disabled={isLoading}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`px-4 py-2 rounded ${
                    isFormValid && !isLoading
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "در حال ایجاد..." : "ایجاد کاربر"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
