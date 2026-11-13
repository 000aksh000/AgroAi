import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuth } from "./AuthContext";
const FarmContext = createContext(void 0);
export const FarmProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(null);
  const {
    data: farms = [],
    isLoading: isLoadingFarms,
    refetch: refetchFarms
  } = useQuery({
    queryKey: ["user-farms"],
    queryFn: async () => {
      const res = await apiClient.get("/farms");
      return res.data.data;
    },
    enabled: isAuthenticated
  });
  useEffect(() => {
    if (farms.length > 0 && !selectedFarm) {
      setSelectedFarm(farms[0]);
    } else if (farms.length === 0) {
      setSelectedFarm(null);
    }
  }, [farms, selectedFarm]);
  return <FarmContext.Provider
    value={{
      farms,
      selectedFarm,
      setSelectedFarm,
      isLoadingFarms,
      refetchFarms
    }}
  >
      {children}
    </FarmContext.Provider>;
};
export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm must be used within a FarmProvider");
  }
  return context;
};
