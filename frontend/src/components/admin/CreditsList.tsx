import { User } from "@/types/user";
import { useState, type FC } from "react";

export interface ICredit {
  id: number;
  user_id: number;
  limit_bw: number;
  limit_user: number;
  suspend: boolean;
  used_bw: number;
  used_user: number;
  ip_limit: null;
  domain_limit: null;
  used_ips: null;
  used_domains: null;
  meta_data: null | {};
  expired_at: null | string;
  deleted_at: null | string;
  created_at: null | string;
  updated_at: null | string;
  user: User;
}

interface CreditsListProps {
  credits: ICredit[];
  onUpdate: (
    id: number,
    data: { limit_bw: number; limit_user: number }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const CreditsList: FC<CreditsListProps> = ({ credits, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    limit_bw: number;
    limit_user: number;
  }>({ limit_bw: 0, limit_user: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (credit: ICredit) => {
    setEditingId(credit.user_id);
    console.log(credit.limit_user);
    setEditData({
      limit_bw: credit.limit_bw,
      limit_user: credit.limit_user,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (id: number) => {
    setIsLoading(true);
    try {
      await onUpdate(id, editData);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating credit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto text-center">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              کاربر
            </th>
            <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              محدودیت پهنای باند (MB)
            </th>
            <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              محدودیت کاربر
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              اقدامات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {credits.map((credit) => (
            <tr
              key={credit.user_id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {credit.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === credit.user_id ? (
                  <input
                    type="number"
                    name="limit_bw"
                    value={editData.limit_bw}
                    onChange={handleEditChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    min="0"
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-white">
                    {credit.limit_bw}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === credit.user_id ? (
                  <input
                    type="number"
                    name="limit_user"
                    value={editData.limit_user}
                    onChange={handleEditChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    min="0"
                  />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-white">
                    {credit.limit_user}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingId === credit.user_id ? (
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => handleSubmit(credit.user_id)}
                      disabled={isLoading}
                      className="text-green-600 hover:text-green-900 dark:text-white dark:hover:text-green-300 disabled:opacity-50 w-20 bg-indigo-600 rounded cursor-pointer"
                    >
                      <span className="rtl inline-block">{isLoading ? "در حال ذخیره..." : "ذخیره"}</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-300 w-20 bg-amber-600 rounded cursor-pointer"
                    >
                      انصراف
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => handleEditClick(credit)}
                      className="bg-blue-600 hover:text-blue-900 dark:text-blue-50 dark:hover:text-blue-300 w-20 rounded cursor-pointer"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => onDelete(credit.user_id)}
                      className="bg-red-500 hover:text-red-900 dark:text-red-50 dark:hover:text-red-300 w-20 rounded cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditsList;
