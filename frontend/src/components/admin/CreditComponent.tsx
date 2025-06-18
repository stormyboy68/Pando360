import { useEffect, useState, type FC } from "react";
import CreditModal from "./CreditModal";
import { DeleteWT, GetWT, PostWT, PutWT } from "@/Rotuer/RouteOutWTClient";
import { User } from "@/types/user";
import { useNotification } from "../etc/ToastNotification/useNotification";
import CreditsList, { ICredit } from "./CreditsList";

interface CreditComponentProps {}

const CreditComponent: FC<CreditComponentProps> = ({}) => {
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(
    null
  );
  const [userList, setUserList] = useState<User[] | []>([]);
  const { showNotification } = useNotification();
  const [credits, setCredits] = useState<ICredit[]|[]>([]);

  const handleSetCredit = async (creditData: {
    limit_bw: number;
    limit_user: number;
  }) => {
    const response = await PostWT(
      `/admin/users/${selectedUserId}/credit`,
      creditData
    );
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    setIsCreditModalOpen(false);
    getCreditList();
  };
  const getUserList = async () => {
    const response = await GetWT("/users");
    setUserList(response.data);
  };
  const getCreditList = async () => {
    const response = await GetWT("/admin/users/credits");
    setCredits(response.data);
  };
    const handleUpdate = async (id: number, data: { limit_bw: number; limit_user: number }) => {
    const response = await PutWT(
      `/admin/users/${id}/credit`,
      data
    );
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }

    setCredits(credits.map(c => c.user_id === id ? { ...c, ...data } : c));
  };

  const handleDelete = async (id: number) => {
    const response = await DeleteWT(`/admin/users/${id}/credit`);
    if (response?.message) {
      showNotification(
        response.message as string,
        response.success ? "success" : "error"
      );
    }
    setCredits(credits.filter(c => c.user_id !== id));
  };
  useEffect(() => {
    getUserList();
    getCreditList();
  }, []);
  return (
    <div>
      <div className="flex justify-end items-center">
        <button
          onClick={() => {
            setIsCreditModalOpen(true);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          تنظیم اعتبار
        </button>

        <CreditModal
          isOpen={isCreditModalOpen}
          onChangeUserId={setSelectedUserId}
          userId={selectedUserId}
          onClose={() => setIsCreditModalOpen(false)}
          onSubmit={handleSetCredit}
          userList={userList}
          initialData={{ limit_bw: 1000, limit_user: 10 }} // مقادیر پیش‌فرض اختیاری
        />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          مدیریت اعتبارات کاربران
        </h1>
        <CreditsList
          credits={credits}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
export default CreditComponent;
