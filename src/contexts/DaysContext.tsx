import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { DaysOfWeek } from '../types';

interface DaysContextData {
  selectedDays: DaysOfWeek;
  toggleDay: (day: keyof DaysOfWeek) => Promise<void>;
  isLoading: boolean;
}

const defaultDays: DaysOfWeek = {
  segunda: true,
  terca: true,
  quarta: true,
  quinta: true,
  sexta: true,
};

export const DaysContext = createContext<DaysContextData>({} as DaysContextData);

export const DaysProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDays, setSelectedDays] = useState<DaysOfWeek>(defaultDays);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDays();
  }, []);

  const loadDays = async () => {
    const storedDays = await StorageService.getItem<DaysOfWeek>(StorageKeys.SELECTED_DAYS);
    if (storedDays) {
      setSelectedDays(storedDays);
    }
    setIsLoading(false);
  };

  const toggleDay = async (day: keyof DaysOfWeek) => {
    const newDays = { ...selectedDays, [day]: !selectedDays[day] };
    setSelectedDays(newDays);
    await StorageService.setItem(StorageKeys.SELECTED_DAYS, newDays);
  };

  return (
    <DaysContext.Provider value={{ selectedDays, toggleDay, isLoading }}>
      {children}
    </DaysContext.Provider>
  );
};