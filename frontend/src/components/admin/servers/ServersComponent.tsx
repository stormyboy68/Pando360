import { useEffect, useState, type FC } from "react";
import ServerFormModal from "./ServerFormModal";
import { DeleteWT, GetWT, PostWT, PutWT } from "@/Rotuer/RouteOutWTClient";
import { Interface } from "readline";
import { IPanels } from "@/app/page";
import ServerList from "./ServerList";
import { useNotification } from "@/components/etc/ToastNotification/useNotification";

interface ServersComponentProps {}
export interface IServers {
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

const ServersComponent: FC<ServersComponentProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servers, setServers] = useState<IServers[] | []>([]);
  const [panels, setPanels] = useState<IPanels[] | []>([]);
  const { showNotification } = useNotification();

  const handleSubmit = async (serverData: Partial<IServers>) => {
    const response =await PostWT("/servers", serverData);
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    setIsModalOpen(false);
    getServers();
  };
  const getServers = async () => {
    const response = await GetWT("/servers");
    setServers(response.data);
  };
  const getPanels = async () => {
    const response = await GetWT("/panels");
    setPanels(response.data);
  };
  const handleUpdate = async (id: number, updatedData: Partial<IServers>) => {
     const response =await PutWT(`/servers/${id}`,updatedData);
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    setServers(
      servers.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const handleDelete = async (id: number) => {
     const response =await DeleteWT(`/servers/${id}`);
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    setServers(servers.filter((s) => s.id !== id));
  };
  useEffect(() => {
    getServers();
    getPanels();
  }, []);
  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        افزودن سرور جدید
      </button>

      <ServerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        panels={panels}
      />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          مدیریت سرورها
        </h1>
        <ServerList
          servers={servers}
          panels={panels}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
export default ServersComponent;
