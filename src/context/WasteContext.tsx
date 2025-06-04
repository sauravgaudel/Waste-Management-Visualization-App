
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WasteEntry {
  id: string;
  wasteType: string;
  quantity: number;
  pickupDate: string;
  notes?: string;
  photo?: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  status: 'pending' | 'assigned' | 'collected';
  assignedTruck?: {
    truckNumber: string;
    driverName: string;
    currentLocation: {
      lat: number;
      lng: number;
    };
  };
}

interface WasteContextType {
  wasteEntries: WasteEntry[];
  addWasteEntry: (entry: Omit<WasteEntry, 'id' | 'timestamp' | 'status'>) => void;
  assignTruck: (entryId: string, truckNumber: string, driverName: string) => void;
  updateTruckLocation: (entryId: string, location: { lat: number; lng: number }) => void;
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('wasteEntries');
    if (savedEntries) {
      setWasteEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save data to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('wasteEntries', JSON.stringify(wasteEntries));
  }, [wasteEntries]);

  const addWasteEntry = (entry: Omit<WasteEntry, 'id' | 'timestamp' | 'status'>) => {
    const newEntry: WasteEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setWasteEntries(prev => [...prev, newEntry]);
  };

  const assignTruck = (entryId: string, truckNumber: string, driverName: string) => {
    setWasteEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { 
            ...entry, 
            status: 'assigned' as const,
            assignedTruck: {
              truckNumber,
              driverName,
              currentLocation: entry.coordinates // Start at pickup location
            }
          }
        : entry
    ));
  };

  const updateTruckLocation = (entryId: string, location: { lat: number; lng: number }) => {
    setWasteEntries(prev => prev.map(entry => 
      entry.id === entryId && entry.assignedTruck
        ? { 
            ...entry,
            assignedTruck: {
              ...entry.assignedTruck,
              currentLocation: location
            }
          }
        : entry
    ));
  };

  return (
    <WasteContext.Provider value={{
      wasteEntries,
      addWasteEntry,
      assignTruck,
      updateTruckLocation
    }}>
      {children}
    </WasteContext.Provider>
  );
};

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (context === undefined) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};
