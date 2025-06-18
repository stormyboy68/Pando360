"use client"
import { useState, type FC } from "react";
import { FaCreditCard, FaServer, FaUserCircle } from "react-icons/fa";
import Container from "../container";
import AdminsComponent from "./AdminsComponent";
import PermissionComponent from "./PermissionComponent";
import { FaPersonMilitaryToPerson } from "react-icons/fa6";
import CreditComponent from "./CreditComponent";
import ServersComponent from "./servers/ServersComponent";

interface AdminPageProps {}


const AdminPage: FC<AdminPageProps> = ({}) => {
 const [activeTab, setActiveTab] = useState('admins');

  const renderContent = () => {
    switch(activeTab) {
      case 'admins':
        return <AdminsComponent />;
      case 'permission':
        return <PermissionComponent />;
      case 'credit':
        return <CreditComponent />;
      case 'servers':
        return <ServersComponent />;
      default:
        return <AdminsComponent />;
    }
  };

  return (
    <Container className="my-20">
      <div className="md:flex">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
          {renderContent()}
        </div>
        
        <ul className="flex-column space-y space-y-4 text-sm font-medium md:ms-4 mb-4 md:mb-0">
          <li>
            <button
              onClick={() => setActiveTab('admins')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                activeTab === 'admins' 
                  ? 'text-white bg-blue-700 dark:bg-blue-600' 
                  : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <FaUserCircle size={30} className="me-2" />
              Admins
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('credit')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                activeTab === 'credit' 
                  ? 'text-white bg-blue-700 dark:bg-blue-600' 
                  : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <FaCreditCard size={30} className="me-2" />
              Credit
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('permission')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                activeTab === 'permission' 
                  ? 'text-white bg-blue-700 dark:bg-blue-600' 
                  : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
                <FaPersonMilitaryToPerson size={25} className="me-2" />
              Permission
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('servers')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                activeTab === 'servers' 
                  ? 'text-white bg-blue-700 dark:bg-blue-600' 
                  : 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
                <FaServer size={25} className="me-2" />
              Servers
            </button>
          </li>
        </ul>
      </div>
    </Container>
  );
};
export default AdminPage;