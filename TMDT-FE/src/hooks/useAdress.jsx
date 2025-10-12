import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

export default function useAddress() {
  const queryClient = useQueryClient();

  const addressQuery = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await api.get("/users/me/address");
      return res.data.data || [];
    },
  });

  const addAddress = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/users/me/address", data);
      return res.data?.data?.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await api.patch(`/users/me/address/${id}`, data);
      return res.data?.data?.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/me/address/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
    },
  });

  const setDefaultAddress = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/users/me/address/${id}/default`);
      return res.data?.data?.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
    },
  });

  return {
    address: addressQuery.data,
    isLoading: addressQuery.isLoading,
    isError: addressQuery.isError,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
