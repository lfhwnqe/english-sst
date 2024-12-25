"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/utils/fetch";

interface User {
  email: string;
  isAdmin: boolean;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  useEffect(() => {
    checkAdminAndFetchUsers();
    fetchRegistrationSetting();
  }, []);

  const checkAdminAndFetchUsers = async () => {
    try {
      const isAdminResponse = await fetchApi("/auth/is-admin");
      if (!isAdminResponse.success) {
        alert("需要管理员权限");
        router.push("/");
        return;
      }
      fetchUsers();
    } catch (error) {
      alert("权限验证失败");
      router.push("/");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchApi("/auth/users");
      if (response.success) {
        setUsers(response.data.users);
      } else {
        alert("获取用户列表失败");
      }
    } catch (error) {
      alert("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSetAdmin = async (email: string) => {
    try {
      const response = await fetchApi("/auth/set-admin", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (response.success) {
        alert("设置管理员成功");
        fetchUsers();
      } else {
        alert("设置管理员失败");
      }
    } catch (error) {
      alert("操作失败");
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    try {
      const response = await fetchApi("/auth/remove-admin", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (response.success) {
        alert("移除管理员成功");
        fetchUsers();
      } else {
        alert("移除管理员失败");
      }
    } catch (error) {
      alert("操作失败");
    }
  };

  const handleSetAdminClick = (email: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "设置管理员",
      message: `确定要将 ${email} 设置为管理员吗？`,
      onConfirm: () => {
        handleSetAdmin(email);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRemoveAdminClick = (email: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "移除管理员",
      message: `确定要移除 ${email} 的管理员权限吗？`,
      onConfirm: () => {
        handleRemoveAdmin(email);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const fetchRegistrationSetting = async () => {
    try {
      const response = await fetchApi("/auth/registration-setting");
      if (response.success) {
        setRegistrationEnabled(response.data.enabled);
      }
    } catch (error) {
      alert("获取注册设置失败");
    }
  };

  const handleToggleRegistration = async () => {
    setConfirmDialog({
      isOpen: true,
      title: registrationEnabled ? "关闭注册" : "开启注册",
      message: `确定要${registrationEnabled ? '关闭' : '开启'}用户注册功能吗？`,
      onConfirm: async () => {
        try {
          const response = await fetchApi("/auth/registration-setting", {
            method: "POST",
            body: JSON.stringify({ enabled: !registrationEnabled }),
          });

          if (response.success) {
            setRegistrationEnabled(!registrationEnabled);
            alert(response.message);
          } else {
            alert("更新注册设置失败");
          }
        } catch (error) {
          alert("操作失败");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">管理员控制台</h1>

      <div className=" rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">添加管理员</h2>
        <div className="flex gap-2">
          <input
            type="email"
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="输入用户邮箱"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleSetAdminClick(newAdminEmail)}
          >
            设置为管理员
          </button>
        </div>
      </div>

      <div className="rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">用户列表</h2>
        {loading ? (
          <div className="text-center py-4">加载中...</div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.email}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <span className="mr-2">{user.email}</span>
                  {user.isAdmin && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      管理员
                    </span>
                  )}
                </div>
                <div>
                  {user.isAdmin ? (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => handleRemoveAdminClick(user.email)}
                    >
                      移除管理员
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => handleSetAdminClick(user.email)}
                    >
                      设置为管理员
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">系统设置</h2>
        <div className="flex items-center justify-between">
          <span>允许用户注册</span>
          <button
            onClick={handleToggleRegistration}
            className={`px-4 py-2 rounded ${
              registrationEnabled 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {registrationEnabled ? '关闭注册' : '开启注册'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
