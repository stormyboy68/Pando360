"use client";
import { useEffect, useState, type FC } from "react";
import { IUserServer } from "./UserServerList";

interface EditServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: IUserServer;
  onSave: (updatedServer: IUserServer) => Promise<void>;
}

export const EditServerModal: FC<EditServerModalProps> = ({
  isOpen,
  onClose,
  server,
  onSave,
}) => {
  const [formData, setFormData] = useState<IUserServer>(server);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(server);
  }, [server]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving server:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">ویرایش سرور</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
             X
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">نام کاربری</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-500"
                  disabled={true}
                />
              </div>

              <div>
                <label className="block mb-1">محدودیت داده (GB)</label>
                <input
                  type="number"
                  name="data_limit"
                  value={formData.data_limit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">تاریخ انقضا</label>
                <input
                  type="date"
                  name="expire"
                  value={formData.expire}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">وضعیت</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="active">فعال</option>
                  <option value="disabled">غیرفعال</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">یادداشت</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};