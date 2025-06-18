import { useEffect, useState, type FC } from "react";
import { useNotification } from "../etc/ToastNotification/useNotification";
import { User } from "@/types/user";
import { DeleteWT, GetWT, PostWT, PutWT } from "@/Rotuer/RouteOutWTClient";
import UserFormModal from "./UserFormModal";
import AssignServersModal from "./AssignServersModal";

interface AdminsComponentProps {}
const AdminsComponent: FC<AdminsComponentProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAssignServerUserId, setOpenAssignServerUserId] = useState<number | null>(null);
  const [servers, setServers] = useState<{ id: number; name: string }[] | []>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[] | []>([]);
  const { showNotification } = useNotification();

  const handleGetAllUsers = async () => {
    setIsLoading(true);
    const response = await GetWT("/users");
    const users = response?.data;
    setUsers(users);
    setIsLoading(false);
  };

  const handleGetAllServers = async () => {
    const response = await GetWT("/servers");
    const users = response?.data;
    setServers(users);
  };
  const handleSubmitAssignServers = async (
    selectedUserId: number,
    serverIds: number[]
  ) => {
    const response = await PutWT(`/admin/users/${selectedUserId}/server`, {
      server_ids: serverIds,
    });
    console.log(selectedUserId);
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    handleGetAllUsers();
  };

  const handleActiveUser = async (id: number) => {
    const response = await PostWT(`/admin/users/${id}/roles`, {
      role: "admin",
    });
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    handleGetAllUsers();
  };
  const handleDeactiveUser = async (id: number) => {
    const response = await DeleteWT(`/admin/users/${id}/roles`, {
      role: "admin",
    });
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    handleGetAllUsers();
  };
  const handleSubmitCreate = async (formData: {
    user_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await PostWT("/register", formData);
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    handleGetAllUsers();
    setIsModalOpen(false);
  };
  useEffect(() => {
    handleGetAllUsers();
    handleGetAllServers();
  }, []);
  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl text-right font-semibold mb-4 dark:text-white">
        مدیریت کاربران (نماینده)
      </h2>
      <div className="w-full flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 font-bold bg-blue-500 text-white rounded hover:bg-indigo-600"
        >
          ایجاد کاربر(نماینده)
        </button>

        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitCreate}
        />
      </div>
      {isLoading ? (
        <p className="text-center rtl">در حال بارگذاری...</p>
      ) : (
        <ul>
          <li className="flex justify-between items-center border border-gray-600 rounded p-3 my-1 bg-gray-900 text-center">
            <div className="w-full grid grid-cols-12 gap-x-1">
              <div className="w-full col-span-4 font-bold">email</div>
              <div className="w-full col-span-2 font-bold">roles</div>
              <div className="w-full col-span-2 font-bold">status</div>
              <div className="w-full col-span-2 font-bold">action</div>
              <div className="w-full col-span-2 font-bold">Assign Servers</div>
            </div>
          </li>
          {users.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center border border-gray-600 rounded p-3 my-1 hover:bg-gray-600 text-center"
            >
              <div className="w-full grid grid-cols-12 gap-x-1">
                <div className="w-full col-span-4 font-bold">{user.email}</div>
                <div
                  className={`w-full col-span-2 font-bold ${
                    user?.roles[0]?.name === "admin" ? "text-green-400" : ""
                  }`}
                >
                  {user?.roles[0]?.name}
                </div>
                <div
                  className={`w-full col-span-2 font-bold ${
                    user?.status === "active"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {user?.status}
                </div>
                <div className="w-full col-span-2 font-bold">
                  {user?.roles[0]?.name !== "super-admin" ? (
                    user?.roles[0]?.name === "admin" ? (
                      <button
                        className="cursor-pointer border rounded w-30 bg-red-500 hover:bg-red-700 active:outline-red-500 active:outline-4 active:outline-double"
                        onClick={() => handleDeactiveUser(Number(user.id))}
                      >
                        Deactive
                      </button>
                    ) : (
                      <button
                        className="cursor-pointer border rounded w-30 bg-green-600 hover:bg-green-800 focus:outline-green-500 active:outline-4 active:outline-double"
                        onClick={() => handleActiveUser(Number(user.id))}
                      >
                        Active
                      </button>
                    )
                  ) : (
                    ""
                  )}
                </div>
                <div className="w-full col-span-2 font-bold">
                  {user?.roles[0]?.name !== "super-admin" ? (
                    <div className="w-full">
                      <button
                        onClick={() => setOpenAssignServerUserId(Number(user.id))}
                        className="cursor-pointer border w-30 focus:outline-indigo-500 active:outline-4 active:outline-double bg-blue-500 text-white rounded hover:bg-indigo-600"
                      >
                        Servers
                      </button>

                      {openAssignServerUserId === Number(user.id) && (
                        <AssignServersModal
                          key={`user-modal-${user.id}`}
                          isOpen={true}
                          servers={servers}
                          serversUser={user.servers}
                          onSubmit={handleSubmitAssignServers}
                          onClose={() => setOpenAssignServerUserId(null)}
                          userId={Number(user.id)}
                        />
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AdminsComponent;
