"use client";
import { useEffect, useState, type FC } from "react";
import { SearchableSelect } from "../etc/SearchableSelect";
import { DeleteWT, GetWT, PostWT, PutWT } from "@/Rotuer/RouteOutWTClient";
import { useAppSelector } from "@/store/hooks";
import { IUserServer, UserServerList } from "../UserServer/UserServerList";
import { EditServerModal } from "../UserServer/EditServerModal";
import { CreateUserModal } from "../UserServer/CreateUserModal";
import { useNotification } from "../etc/ToastNotification/useNotification";
import { IServers } from "@/app/page";

interface HomeProps {
  selectOptionsservers: {
    value: string;
    label: string;
    url: string;
  }[];
  servers: IServers[];
}

const HomePage: FC<HomeProps> = ({
  selectOptionsservers: initialServers,
  servers,
}) => {
  const user = useAppSelector((state) => state.user);
  const [selectedServerId, setSelectedServerId] = useState<string | number>("");
  const [serversData, setServersData] = useState({
    current_page: 1,
    data: [] as IUserServer[],
    last_page: 1,
    total: 0,
    per_page: 15,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<IUserServer | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const handlePerPageChange = (perPage: number) => {
    setServersData((prev) => ({
      ...prev,
      per_page: perPage,
      current_page: 1,
    }));
  };

  const getUserServer = async (page = 1) => {
    try {
      let response;
      if (user.isSuperAdmin) {
        response = await GetWT(
          `/user-server/${selectedServerId}?page=${page}&perPage=${serversData.per_page}`
        );
      } else {
        response = await GetWT(
          `/user-server/${selectedServerId}/all-user?page=${page}&perPage=${serversData.per_page}`
        );
      }
      setServersData({
        current_page: response.data.current_page,
        data: response.data.data,
        last_page: response.data.last_page,
        total: response.data.total,
        per_page: response.data.per_page,
      });
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  const handleEdit = async (userServer: IUserServer) => {
    console.log(userServer)
    const dataUserServer={
      username: userServer.username,
      data_limit: userServer.data_limit,
      suspend: userServer.suspend,
      expire: userServer.expire,
      data_limit_reset_strategy: userServer.data_limit_reset_strategy, //no_reset,day,week,month,year
      status: userServer.status,
      note: userServer?.note || ""
    }
    try {
      const response =await PutWT(`/user-server/${userServer.id}`, dataUserServer);
      if (response?.message) {
        showNotification(
          response.message as string,
          response.success ? "success" : "error"
        );
      }
      getUserServer(serversData.current_page);
    } catch (error) {
      console.error("Error deleting server:", error);
    }
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userServerId: number) => {
    try {
      await DeleteWT(`/user-server/${userServerId}`);
      getUserServer(serversData.current_page);
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  const handleSaveServer = async (updatedServer: IUserServer) => {
    try {
      await PostWT(`/user-server/${updatedServer.id}/update`, updatedServer);
      getUserServer(serversData.current_page);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating server:", error);
    }
  };

  const handleCreateUser = async (
    userData: Partial<IUserServer>,
    serverId: string | number
  ) => {
    try {
      const response = await PostWT(`/user-server/${serverId}`, userData);
      if (response?.message) {
        showNotification(
          response.message as string,
          response.success ? "success" : "error"
        );
      }
      setSelectedServerId(serverId);
      getUserServer();
      setIsCreateUserModalOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (selectedServerId) {
      getUserServer();
      setBaseUrl(
        servers.find((item) => item.id == selectedServerId)?.url || ""
      );
    }
  }, [selectedServerId, serversData.per_page]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">مدیریت سرورها</h1>
        <button
          onClick={() => setIsCreateUserModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          کاربر جدید
        </button>
      </div>

      <div className="mb-4">
        <SearchableSelect
          options={initialServers}
          value={selectedServerId}
          onChange={setSelectedServerId}
          placeholder="سرور را انتخاب کنید"
          className="w-full md:w-64"
        />
      </div>

      {selectedServerId ? (
        <>
          <UserServerList
            data={serversData}
            handlePerPageChange={handlePerPageChange}
            baseUrl={baseUrl}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          لطفاً یک سرور را از لیست انتخاب کنید
        </div>
      )}

      {selectedServer && (
        <EditServerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          server={selectedServer}
          onSave={handleSaveServer}
        />
      )}

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        optionsServer={initialServers}
        onClose={() => setIsCreateUserModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default HomePage;
