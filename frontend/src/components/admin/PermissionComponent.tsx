import { GetWT, PostWT } from "@/Rotuer/RouteOutWTClient";
import { useEffect, useState, type FC } from "react";
import { useNotification } from "../etc/ToastNotification/useNotification";


interface PermissionComponentProps {}
interface Permission {
  id: number;
  name: string;
  guard_name: string;
  pivot?: {
    role_id: number;
    permission_id: number;
  };
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

const PermissionComponent: FC<PermissionComponentProps> = ({}) => {
  const allPermissions = [
    "create user",
    "edit user", 
    "delete user",
    "suspend user",
  ];
  
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const submitPermissions = async () => {
    try {
      setIsLoading(true);
      const response = await PostWT("/admin/roles/2/permissions", {
        permissions: selectedPermissions,
      });
      
      if (response?.message) {
        showNotification(
          response.message as string,
          response.success ? "success" : "error"
        );
      }
    } catch (error) {
      console.error("Error submitting permissions:", error);
      showNotification("خطا در ارسال مجوزها", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissions = async () => {
    try {
      setIsLoading(true);
      const response = await GetWT("/admin/roles");
      console.log(response)
      const permissions: Permission[] = response.data[0].permissions;
      
      // تبدیل لیست permissions دریافتی به آرایه نام‌های مجوزها
      const permissionNames = permissions.map(p => p.name);
      setSelectedPermissions(permissionNames);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      showNotification("خطا در دریافت مجوزها", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl text-right font-semibold mb-4 dark:text-white">
        مدیریت مجوزها
      </h2>

      {isLoading ? (
        <p className="text-center rtl">در حال بارگذاری...</p>
      ) : (
        <>
          <div className="space-y-3">
            {allPermissions.map((permission) => (
              <div key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  id={`permission-${permission}`}
                  checked={selectedPermissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`permission-${permission}`}
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {permission}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={submitPermissions}
            disabled={selectedPermissions.length === 0 || isLoading}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "در حال ذخیره..." : "ذخیره مجوزها"}
          </button>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <h3 className="font-medium dark:text-white">مجوزهای انتخاب شده:</h3>
            {selectedPermissions.length > 0 ? (
              <ul className="list-disc list-inside mt-2 dark:text-gray-300">
                {selectedPermissions.map((permission) => (
                  <li key={permission}>{permission}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                هنوز مجوزی انتخاب نشده است
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionComponent;