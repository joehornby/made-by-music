"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Album, Collection } from "@/types/album";

interface ChartData {
  id: string;
  title: string;
  description: string;
  duration: number;
  picture_big: string;
}

interface DataContextType {
  collections: Collection[];
  charts: ChartData[];
  loading: {
    collections: boolean;
    charts: boolean;
  };
  error: {
    collections: string | null;
    charts: string | null;
  };
  refetchCollections: () => Promise<void>;
  refetchCharts: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState({
    collections: true,
    charts: true,
  });
  const [error, setError] = useState({
    collections: null as string | null,
    charts: null as string | null,
  });

  const fetchCollections = async () => {
    try {
      setLoading(prev => ({ ...prev, collections: true }));
      setError(prev => ({ ...prev, collections: null }));
      
      const response = await fetch('/api');
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      setCollections(data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        collections: err instanceof Error ? err.message : 'Unknown error' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, collections: false }));
    }
  };

  const fetchCharts = async () => {
    try {
      setLoading(prev => ({ ...prev, charts: true }));
      setError(prev => ({ ...prev, charts: null }));
      
      const response = await fetch('/api/charts');
      if (!response.ok) throw new Error('Failed to fetch charts');
      const data = await response.json();
      setCharts(data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        charts: err instanceof Error ? err.message : 'Unknown error' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, charts: false }));
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchCharts();
  }, []);

  const value: DataContextType = {
    collections,
    charts,
    loading,
    error,
    refetchCollections: fetchCollections,
    refetchCharts: fetchCharts,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
