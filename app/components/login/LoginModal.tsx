// LoginModal.tsx
import React, { MouseEvent, useState } from "react";
import styles from "./login.module.scss";
import { useUserStore } from "@/app/store";
import { loginUser } from "@/app/api/userApi";
import { DEFAULT_USER } from "@/app/store/model/user";
import { useSyncStore } from "@/app/store/sync"; // 导入useUserStore钩子

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore(); // 使用useUserStore钩子
  const isLogin = useUserStore().isLogin();
  let serverstash = useSyncStore().serverstash;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage(""); // 清除之前的错误信息
    // 处理登录逻辑
    // 假设我们有一个API调用来验证用户
    try {
      if (isLogin) {
        console.log("Logout successful");
        setUser(DEFAULT_USER); // 更新用户状态
        serverstash.apiKey = "";
        onClose(); // 关闭模态框
      } else {
        const user = await loginUser(username, password); // loginUser是一个示例API函数
        setUser(user); // 更新用户状态
        serverstash.apiKey = user.token;
        console.log("Login successful");
        console.log("Hello:", user.username);
        onClose(); // 关闭模态框
      }
    } catch (error) {
      // 检查错误对象是否是Error类型，并设置相应的错误信息
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        // 如果错误对象不是Error类型，可以设置一个通用的错误信息
        setErrorMessage("An unexpected error occurred");
      }
      console.error("Login failed:", error);
    }
    setIsLoading(false);
  };

  const handleMaskClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-mask" onClick={handleMaskClick}>
      <div className={styles["login-modal-content"]}>
        <button className={styles["close-button"]} onClick={onClose}>
          &times;
        </button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className={styles["login-form"]}>
          <div className={styles["input-group"]}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles["input-group"]}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              disabled={isLoading}
            />
          </div>
          {errorMessage && (
            <div className={styles["error-message"]}>{errorMessage}</div>
          )}
          <div className={styles["actions"]}>
            <button
              type="submit"
              className={styles["login-button"]}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : isLogin ? "Logged out" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
