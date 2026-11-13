import React, { createContext, useContext, useState, useEffect } from 'react';
import { IFarm } from '@agrosmart/shared-types';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuth } from './AuthContext';

interface FarmContextType {
  farms: IFarm[];
  selectedFarm: IFarm | null;
  setSelectedFarm: (farm: IFarm | null) => void;
  isLoadingFarms: boolean;
  refetchFarms: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState<IFarm | null>(null);

  const {
    data: farms = [],
    isLoading: isLoadingFarms,
    refetch: refetchFarms,
  } = useQuery({
    queryKey: ['user-farms'],
    queryFn: async () => {
      const res = await apiClient.get('/farms');
      return res.data.data as IFarm[];
    },
    enabled: isAuthenticated,
  });

  // Automatically select the first farm if none is selected
  useEffect(() => {
    if (farms.length > 0 && !selectedFarm) {
      setSelectedFarm(farms[0]);
    } else if (farms.length === 0) {
      setSelectedFarm(null);
    }
  }, [farms, selectedFarm]);

  return (
    <FarmContext.Provider
      value={{
        farms,
        selectedFarm,
        setSelectedFarm,
        isLoadingFarms,
        refetchFarms,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
