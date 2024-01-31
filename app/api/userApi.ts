// userApi.ts
import { User } from "@/app/store/model/user";
export const loginUser = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    const response = await fetch("/server/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      // 如果HTTP状态码不是2xx，抛出错误
      throw new Error(
        "Error response" + response.status + " " + response.statusText,
      );
    }
    // 在这里处理响应，解析响应数据到User对象
    const user = await response.json();
    if (user.code === 0) {
      throw new Error("Invalid username or password");
    }
    return user;
  } catch (error) {
    // 在这里处理错误，例如网络错误或JSON解析错误
    throw new Error(
      `Login failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
