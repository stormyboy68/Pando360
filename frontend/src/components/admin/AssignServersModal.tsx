import { server } from "@/types/user";
import { useEffect, useState, type FC } from "react";
import { MultiSelect } from "react-multi-select-component";

interface Server {
  id: number;
  name: string;
}

interface AssignServersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: number, serverIds: number[]) => void;
  servers: Server[];
  serversUser?: server[];
  userId?: number; // اختیاری - می‌تواند از بیرون پاس داده شود یا داخل مدال انتخاب شود
}

const AssignServersModal: FC<AssignServersModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  servers,
  serversUser,
  userId,
}) => {
  const [selectedServers, setSelectedServers] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(userId || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (serversUser && Array.isArray(serversUser)) {
        setSelectedServers(
          serversUser
            .map((server) => ({
              value: Number(server.id),
              label: server.name,
            }))
            .filter((item) => !isNaN(item.value))
        );
        setSelectedUserId(userId || 0);
      }
    }
  }, [isOpen, serversUser, userId]);

  // تبدیل لیست سرورها به فرمت مورد نیاز برای MultiSelect
  const serverOptions = servers.map((server) => ({
    value: server.id,
    label: server.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const serverIds = selectedServers.map((server) => server.value);
      await onSubmit(selectedUserId, serverIds);
      onClose();
    } catch (error) {
      console.error("Error assigning servers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              اختصاص سرور به کاربر
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
            {!userId && (
              <div className="mb-4">
                <label
                  htmlFor="userId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  شناسه کاربر
                </label>
                <input
                  type="number"
                  id="userId"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
            )}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                انتخاب سرورها
              </label>
              <MultiSelect
                options={serverOptions}
                value={selectedServers}
                onChange={setSelectedServers}
                labelledBy="Select servers"
                className="dark:bg-gray-800 dark:text-black"
                overrideStrings={{
                  selectSomeItems: "سرورها را انتخاب کنید...",
                  allItemsAreSelected: "همه سرورها انتخاب شده‌اند",
                  selectAll: "انتخاب همه",
                  search: "جستجو",
                }}
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
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isLoading ? "در حال ثبت..." : "تایید"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignServersModal;
