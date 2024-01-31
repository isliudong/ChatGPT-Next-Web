// useUserStore.ts
import { createPersistStore } from "../utils/store";
import { StoreKey } from "../constant";
import { DEFAULT_USER, User } from "./model/user";
import { UserConfig } from "@/app/store/model/user";

export const useUserStore = createPersistStore(
  { ...DEFAULT_USER },
  (set, get) => ({
    setUser(user: User) {
      set(() => ({ ...user }));
    },
    resetUser() {
      set(() => ({ ...DEFAULT_USER }));
    },
    isLogin() {
      return !!get().token;
    },
  }),
  {
    name: StoreKey.User, // 确保这个key是唯一的
    version: 1.0,
    migrate: (persistedState: unknown, version: number) => {
      // 假设我们在版本1.1添加了avatarUrl字段
      // 首先，将未知类型转换为部分用户配置类型
      const state = persistedState as Partial<UserConfig>;

      if (version < 1.1) {
        // 如果版本低于1.1，我们需要添加avatarUrl字段
        state.avatarUrl = state.avatarUrl || "";
      }
      return persistedState as any;
    },
  },
);
