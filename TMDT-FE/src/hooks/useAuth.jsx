import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

export default function useAuth() {
  const queryClient = useQueryClient();

  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.data.user;
    },
    retry: false,
  });

  const signup = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/signup", data);
      return res.data;
    },
  });

  const resendOtp = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/resend-otp", data);
      return res.data;
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/verify-otp", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });

  const login = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/login", data);
      return res.data.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["auth"]);
    },
  });

  const updateMe = useMutation({
    mutationFn: async (data) => {
      const res = await api.patch("/users/me", data);
      return res.data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await api.post("/users/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
    },
  });

  const confirmChangePassword = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/me/confirm-change-password", data);
      return res.data.valid;
    },
  });

  const changePassword = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/me/change-password", data);
      return res.data;
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return {
    user: authQuery.data,
    isLoading: authQuery.isLoading,
    isError: authQuery.isError,
    login,
    signup,
    verifyOtp,
    resendOtp,
    updateMe,
    logout,
    confirmChangePassword,
    changePassword,
  };
}
