import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    user: {},
    meta: {},
  }),
  getters: {
    getUserList: (state) => state.users,
    getMeta: (state) => state.meta,
    getUser: (state) => state.user,
  },
  actions: {
    async fetchUsers(page = 0) {
      const res = await api.get("/user", {
        params: {
          page: page,
        },
      });
      const { data, ...meta } = res.data;
      this.meta = meta;
      this.users = data.map((user) => {
        const { picture, ...userData } = user;
        return userData;
      });
    },
    async fetchUserDetail(id) {
      const res = await api.get(`/user/${id}`);
      this.user = res.data;
    },
    async addUser(data) {
      await api.post("/user/create", data);
      return true;
    },
    async editUser(id, data) {
      const res = await api.put(`/user/${id}`, data);
      this.user = res.data;
    },
    async removeUser(id) {
      await api.delete(`/user/${id}`);
      return id;
    },
  },
});
