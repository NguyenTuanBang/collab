import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export function useCartCount() {
  return useQuery({
    queryKey: ["cartCount"],
    queryFn: async () => {
      const res = await api.get("/cart/count");
      return res.data.data;
    },
    staleTime: 1000 * 30, 
    refetchOnWindowFocus: false, 
  });
}
