import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  status: "online" | "offline";
  avatar: string;
}

const AdminManageUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Neil Sims",
      email: "neil.sims@flowbite.com",
      position: "React Developer",
      status: "online",
      avatar: "/docs/images/people/profile-picture-1.jpg",
    },
    {
      id: 2,
      name: "Bonnie Green",
      email: "bonnie@flowbite.com",
      position: "Designer",
      status: "online",
      avatar: "/docs/images/people/profile-picture-3.jpg",
    },
    // Add more users as needed
  ]);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  interface UserRowProps {
    user: User;
    isSelected: boolean;
    onSelect: (id: number) => void;
  }

  const UserRow = ({ user, isSelected, onSelect }: UserRowProps) => (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id={`checkbox-table-search-${user.id}`}
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={isSelected}
            onChange={() => onSelect(user.id)}
          />
          <label
            htmlFor={`checkbox-table-search-${user.id}`}
            className="sr-only"
          >
            Select user
          </label>
        </div>
      </td>
      <th
        scope="row"
        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          className="w-10 h-10 rounded-full"
          src={user.avatar}
          alt={`${user.name} avatar`}
        />
        <div className="ps-3">
          <div className="text-base font-semibold">{user.name}</div>
          <div className="font-normal text-gray-500">{user.email}</div>
        </div>
      </th>
      <td className="px-6 py-4">{user.position}</td>
      <td className="px-6 py-4">
        <StatusIndicator status={user.status} />
      </td>
      <td className="px-6 py-4">
        <a
          href="#"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Edit user
        </a>
      </td>
    </tr>
  );

  const StatusIndicator = ({ status }: { status: "online" | "offline" }) => (
    <div className="flex items-center">
      <div
        className={`h-2.5 w-2.5 rounded-full me-2 ${status === "online" ? "bg-green-500" : "bg-red-500"}`}
      ></div>
      {status === "online" ? "Online" : "Offline"}
    </div>
  );

  const SearchIcon = () => (
    <svg
      className="w-4 h-4 text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      />
    </svg>
  );

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg mt-8 mr-8">
      {/* Table Actions */}
      <div className="flex items-center justify-end flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 pt-4 pr-4">
        <div className="relative ">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none ">
            <SearchIcon />
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={
                    selectedUsers.length === users.length && users.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  Select all
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Position
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onSelect={toggleUserSelection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageUser;
