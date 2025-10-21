"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getCollections,
  getAlbums,
  type Collection,
  type Album,
} from "@/lib/api";

interface DataContextType {
  collections: Collection[];
  albums: Album[];
  loading: {
    collections: boolean;
    albums: boolean;
  };
  error: {
    collections: string | null;
    albums: string | null;
  };
  refetchCollections: () => Promise<void>;
  refetchAlbums: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState({
    collections: true,
    albums: true,
  });
  const [error, setError] = useState({
    collections: null as string | null,
    albums: null as string | null,
  });

  const fetchCollections = async () => {
    try {
      setLoading((prev) => ({ ...prev, collections: true }));
      setError((prev) => ({ ...prev, collections: null }));

      const response = await getCollections();
      setCollections(response.data);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError((prev) => ({
        ...prev,
        collections: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, collections: false }));
    }
  };

  const fetchAlbums = async () => {
    try {
      setLoading((prev) => ({ ...prev, albums: true }));
      setError((prev) => ({ ...prev, albums: null }));

      const response = await getAlbums();
      setAlbums(response.data);
    } catch (err) {
      console.error("Error fetching albums:", err);
      setError((prev) => ({
        ...prev,
        albums: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, albums: false }));
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchAlbums();
  }, []);

  const value: DataContextType = {
    collections,
    albums,
    loading,
    error,
    refetchCollections: fetchCollections,
    refetchAlbums: fetchAlbums,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}