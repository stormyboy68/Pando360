import { useState, type FC } from "react";

interface Server {
  id: number;
  name: string;
  panel_id: number;
  panel_name?: string;
  url: string;
  username: string;
  password: string;
  client_id?: string;
  client_secret?: string;
  grant_type?: string;
}

interface ServerListProps {
  servers: Server[];
  panels: { id: number; name: string }[];
  onUpdate: (id: number, serverData: Partial<Server>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ServerList: FC<ServerListProps> = ({ servers, panels, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Server>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (server: Server) => {
    setEditingId(server.id);
    setEditData({
      name: server.name,
      panel_id: server.panel_id,
      url: server.url,
      username: server.username,
      password: server.password,
      client_id: server.client_id,
      client_secret: server.client_secret,
      grant_type: server.grant_type || "password",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (id: number) => {
    setIsLoading(true);
    try {
      await onUpdate(id, editData);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating server:", error);
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
              نام سرور
            </th>
            <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              پنل
            </th>
            <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              آدرس
            </th>
            <th className="px-6 py-3  text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              اقدامات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {servers.map((server) => (
            <>
              {/* ردیف اصلی */}
              <tr key={server.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {server.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {server.panel_name || panels.find(p => p.id === server.panel_id)?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {server.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => handleEditClick(server)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => onDelete(server.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>

              {/* ردیف ویرایش */}
              {editingId === server.id && (
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={4} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          نام سرور *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editData.name || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          پنل *
                        </label>
                        <select
                          name="panel_id"
                          value={editData.panel_id || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                          required
                        >
                          {panels.map(panel => (
                            <option key={panel.id} value={panel.id}>
                              {panel.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          آدرس سرور (URL) *
                        </label>
                        <input
                          type="url"
                          name="url"
                          value={editData.url || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          نام کاربری *
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={editData.username || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          رمز عبور *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={editData.password || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Client ID
                        </label>
                        <input
                          type="text"
                          name="client_id"
                          value={editData.client_id || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Client Secret
                        </label>
                        <input
                          type="text"
                          name="client_secret"
                          value={editData.client_secret || ""}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-white"
                        >
                          انصراف
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmit(server.id)}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                          {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServerList;