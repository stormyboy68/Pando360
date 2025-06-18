import { User } from "@/types/user";
import { useState, type FC } from "react";
import { SearchableSelect } from "../etc/SearchableSelect";

interface CreditModalProps {
  userList: User[] | [];
  userId: number | string | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (creditData: { limit_bw: number; limit_user: number }) => void;
  onChangeUserId: (userId: string | number) => void;
  initialData?: { limit_bw: number; limit_user: number };
}

const CreditModal: FC<CreditModalProps> = ({
  userList,
  userId,
  onChangeUserId,
  isOpen,
  onClose,
  onSubmit,
  initialData = { limit_bw: 0, limit_user: 0 },
}) => {
  const [creditData, setCreditData] = useState({
    limit_bw: initialData.limit_bw,
    limit_user: initialData.limit_user,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreditData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(creditData);
      onClose();
    } catch (error) {
      console.error("Error submitting credit data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              تنظیم اعتبار کاربر
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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="limit_bw"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                محدودیت پهنای باند (مگابایت)
              </label>
              <SearchableSelect
                onChange={onChangeUserId}
                value={userId}
                options={userList.map((user) => {
                  return { value: user.id, label: user.email };
                })}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="limit_bw"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                محدودیت پهنای باند (مگابایت)
              </label>
              <input
                type="number"
                id="limit_bw"
                name="limit_bw"
                value={creditData.limit_bw}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                min="1"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="limit_user"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                محدودیت تعداد کاربر
              </label>
              <input
                type="number"
                id="limit_user"
                name="limit_user"
                value={creditData.limit_user}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isLoading || !userId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditModal;
