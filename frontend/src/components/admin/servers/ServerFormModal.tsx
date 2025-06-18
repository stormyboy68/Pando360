import { SearchableSelect } from "@/components/etc/SearchableSelect";
import { useState, type FC } from "react";


interface Panel {
  id: number;
  name: string;
}

interface ServerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serverData: {
    name: string;
    panel_id: number;
    url: string;
    username: string;
    password: string;
    client_id?: string;
    client_secret?: string;
    grant_type?: string;
  }) => Promise<void>;
  panels: Panel[];
}

const ServerFormModal: FC<ServerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  panels,
}) => {
  const [serverData, setServerData] = useState({
    name: "",
    panel_id: 0,
    url: "",
    username: "",
    password: "",
    client_id: "",
    client_secret: "",
    grant_type: "password",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePanelChange = (value: string | number ) => {
    setServerData((prev) => ({
      ...prev,
      panel_id: Number(value),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!serverData.name.trim()) newErrors.name = "نام سرور الزامی است";
    if (!serverData.panel_id) newErrors.panel_id = "پنل الزامی است";
    if (!serverData.url.trim()) newErrors.url = "آدرس سرور الزامی است";
    if (!serverData.username.trim()) newErrors.username = "نام کاربری الزامی است";
    if (!serverData.password.trim()) newErrors.password = "رمز عبور الزامی است";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        ...serverData,
        grant_type: "password", // مقدار پیش‌فرض
      });
      onClose();
      // ریست فرم پس از ارسال موفق
      setServerData({
        name: "",
        panel_id: 0,
        url: "",
        username: "",
        password: "",
        client_id: "",
        client_secret: "",
        grant_type: "password",
      });
    } catch (error) {
      console.error("Error submitting server data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              ثبت سرور جدید
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  نام سرور *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={serverData.name}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  پنل *
                </label>
                <SearchableSelect
                  options={panels.map((panel) => ({
                    value: panel.id.toString(),
                    label: panel.name,
                  }))}
                  value={serverData.panel_id.toString()}
                  onChange={handlePanelChange}
                  placeholder="پنل را انتخاب کنید"
                  className={errors.panel_id ? "border-red-500" : ""}
                />
                {errors.panel_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.panel_id}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="url"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  آدرس سرور (URL) *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={serverData.url}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    errors.url ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  نام کاربری *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={serverData.username}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  رمز عبور *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={serverData.password}
                  onChange={handleChange}
                  className={`bg-gray-50 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="client_id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Client ID
                </label>
                <input
                  type="text"
                  id="client_id"
                  name="client_id"
                  value={serverData.client_id}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="client_secret"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Client Secret
                </label>
                <input
                  type="text"
                  id="client_secret"
                  name="client_secret"
                  value={serverData.client_secret}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isLoading ? "در حال ثبت..." : "ثبت سرور"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServerFormModal;