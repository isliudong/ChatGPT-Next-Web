// serverstash.ts
import { SyncClient } from "./index";
import { SyncStore } from "@/app/store/sync";

export type ServerStashConfig = SyncStore["serverstash"];
export type ServerStashClient = ReturnType<typeof createServerStashClient>;

export function createServerStashClient(store: SyncStore): SyncClient {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${store.serverstash.apiKey}`,
  };

  const path = (endpoint: string) => {
    return `${store.serverstash.endpoint}/${endpoint}`;
  };

  return {
    async get(key: string) {
      const response = await fetch(
        store.serverstash.endpoint + "?username=" + key,
        {
          method: "GET",
          headers,
        },
      );
      if (!response.ok) {
        throw new Error("Failed to get data from ServerStash");
      }
      const data = await response.json();
      // data 中code存在，说明获取失败
      console.log("获取data", data);

      if (data.code !== undefined) {
        throw new Error(data.message);
      }
      return data.userData;
    },

    async set(key: string, value: string) {
      const response = await fetch(store.serverstash.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify([{ userData: value, username: key }]),
      });
      let res = await response.json();
      console.log(res);
      if (!response.ok) {
        throw new Error("Failed to set data to ServerStash");
      }
      if (res.code !== undefined) {
        throw new Error(res.message);
      }
    },

    async check() {
      try {
        const response = await fetch(store.serverstash.endpoint, {
          method: "GET",
          headers,
        });
        return response.ok;
      } catch (error) {
        console.error("Failed to check ServerStash availability", error);
        return false;
      }
    },
  };
}
