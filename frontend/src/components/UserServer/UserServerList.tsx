"use client";
import { useState, type FC } from "react";
import { ISelectOption, SearchableSelect } from "../etc/SearchableSelect";
import { Pagination } from "../etc/Pagination";
import { EditServerModal } from "./EditServerModal";
import { LinksModal } from "./LinksModal";

export interface IUserServer {
  id: string | number;
  user_id: string | number;
  server_id: string | number;
  username: string;
  data_limit: string;
  data_used: number;
  suspend: boolean;
  expire: string;
  inbounds: {
    vmess?: string[];
    vless?: string[];
    trojan?: string[];
    shadowsocks?: string[];
  };
  proxies: {
    vmess?: { id: string };
    vless?: { id: string };
    trojan?: { id: string };
    shadowsocks?: { id: string };
  };
  data_limit_reset_strategy: string;
  status: string;
  note: string;
  links: string[];
  subscription_url: string;
}

interface ServerListProps {
  data: {
    current_page: number;
    data: IUserServer[];
    last_page: number;
    total: number;
    per_page: number;
  };
  baseUrl: string | null;
  handlePerPageChange: (per_page: number) => void;
  onEdit: (server: IUserServer) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const UserServerList: FC<ServerListProps> = ({
  data,
  handlePerPageChange,
  baseUrl,
  onEdit,
  onDelete,
}) => {
  const [selectedServerLinks, setSelectedServerLinks] = useState<{
    links: string[];
    subscriptionUrl: string;
  } | null>(null);
  const [editingServer, setEditingServer] = useState<IUserServer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleEdit = (server: IUserServer) => {
    setEditingServer(server);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting server:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow text-center">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                نام کاربری
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                محدودیت داده
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                مصرف شده
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                انقضا
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                پروتکل
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                اقدامات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.total && data.data?.map((server) => (
              <tr key={server.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {server.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      server.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {server.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {server.data_limit} GB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {server.data_used} Bytes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {server.expire &&
                    new Date(server.expire).toLocaleDateString("fa-IR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() =>
                      setSelectedServerLinks({
                        links: server.links,
                        subscriptionUrl: server.subscription_url,
                      })
                    }
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    نمایش لینک‌ها
                  </button>
                  {selectedServerLinks && (
                    <LinksModal
                      isOpen={!!selectedServerLinks}
                      onClose={() => setSelectedServerLinks(null)}
                      links={selectedServerLinks.links}
                      subscriptionUrl={selectedServerLinks.subscriptionUrl}
                      serverUrl={baseUrl || ""}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(server)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(Number(server.id))}
                    disabled={isDeleting === server.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {isDeleting === server.id ? "در حال حذف..." : "حذف"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t">
        {data.total && (
          <Pagination
            currentPage={data?.current_page}
            totalPages={data?.last_page}
            totalItems={data.total}
            itemsPerPage={data?.per_page}
            setPerPage={handlePerPageChange}
          />
        )}
      </div>

      {editingServer && (
        <EditServerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          server={editingServer}
          onSave={async (updatedServer) => {
            await onEdit(updatedServer);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
