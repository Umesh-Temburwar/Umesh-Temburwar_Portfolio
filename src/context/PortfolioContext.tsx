import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { portfolioData as defaultPortfolioData } from '../data/portfolio';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  uploadResumeToSupabase,
  uploadAssetToSupabase,
} from '../lib/supabase';

export type PortfolioDataType = typeof defaultPortfolioData;

function mergePortfolio(cloud: Partial<PortfolioDataType> | null | undefined): PortfolioDataType {
  if (!cloud) return defaultPortfolioData;

  return {
    ...defaultPortfolioData,
    ...cloud,
    header: { ...defaultPortfolioData.header, ...cloud.header },
    navbar: { ...defaultPortfolioData.navbar, ...cloud.navbar },
    hero: {
      ...defaultPortfolioData.hero,
      ...cloud.hero,
      idCard: { ...defaultPortfolioData.hero.idCard, ...cloud.hero?.idCard },
    },
    about: { ...defaultPortfolioData.about, ...cloud.about },
    skills: { ...defaultPortfolioData.skills, ...cloud.skills },
    resume: { ...defaultPortfolioData.resume, ...cloud.resume },
    contact: { ...defaultPortfolioData.contact, ...cloud.contact },
    projects: cloud.projects ?? defaultPortfolioData.projects,
    experience: cloud.experience ?? defaultPortfolioData.experience,
    education: cloud.education ?? defaultPortfolioData.education,
    certifications: cloud.certifications ?? defaultPortfolioData.certifications,
  };
}

function persistLocal(next: PortfolioDataType) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn(e);
  }
}

interface PortfolioContextType {
  data: PortfolioDataType;
  isLoading: boolean;
  isSaving: boolean;
  isCloudSynced: boolean;
  cloudStatusText: string;
  lastSaved: string | null;
  savePortfolioData: (newData: PortfolioDataType) => Promise<{ success: boolean; error?: string }>;
  uploadResume: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  uploadAsset: (file: File, folder?: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  resetToDefaultData: () => Promise<void>;
  fetchFromCloud: () => Promise<boolean>;
}

const LOCAL_STORAGE_KEY = 'portfolio_custom_data_v1';
const UPDATE_EVENT_NAME = 'portfolio_data_updated';

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initially from localStorage if present to ensure 0ms render latency without flicker
  const [data, setData] = useState<PortfolioDataType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return mergePortfolio(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse local portfolio data, falling back to defaults:', e);
      }
    }
    return defaultPortfolioData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [cloudStatusText, setCloudStatusText] = useState<string>('Checking cloud sync...');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Fetch data from Supabase cloud
  const fetchFromCloud = useCallback(async (): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      setIsCloudSynced(false);
      setCloudStatusText('Local storage mode (Supabase not configured)');
      setIsLoading(false);
      return false;
    }

    try {
      setCloudStatusText('Syncing with Supabase...');
      const { data: row, error } = await client
        .from('portfolio_content')
        .select('data, updated_at')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        setIsCloudSynced(false);
        setCloudStatusText(`Cloud fetch error: ${error.message}`);
        setIsLoading(false);
        return false;
      }

      const cloudData = row?.data;
      const hasCloudData =
        cloudData !== null &&
        cloudData !== undefined &&
        typeof cloudData === 'object' &&
        !Array.isArray(cloudData) &&
        Object.keys(cloudData as object).length > 0;

      if (hasCloudData) {
        const mergedData = mergePortfolio(cloudData as Partial<PortfolioDataType>);
        setData(mergedData);
        persistLocal(mergedData);
        setIsCloudSynced(true);
        setCloudStatusText('Synced with Supabase Cloud');
        if (row?.updated_at) {
          setLastSaved(new Date(row.updated_at).toISOString());
        }
        setIsLoading(false);
        return true;
      }

      const seedPayload: PortfolioDataType = (() => {
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            return mergePortfolio(JSON.parse(saved));
          }
        } catch (e) {
          console.warn(e);
        }
        return defaultPortfolioData;
      })();
      const { error: seedError } = await client.from('portfolio_content').upsert(
        {
          id: 'main',
          data: seedPayload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (seedError) {
        setIsCloudSynced(true);
        setCloudStatusText(`Connected to Supabase (seed pending: ${seedError.message})`);
        setIsLoading(false);
        return false;
      }

      setData(seedPayload);
      persistLocal(seedPayload);
      setIsCloudSynced(true);
      setCloudStatusText('Seeded default portfolio data to Supabase');
      setLastSaved(new Date().toISOString());
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      console.warn('Failed to sync from cloud:', err);
      setIsCloudSynced(false);
      setCloudStatusText('Could not reach cloud database');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Sync on mount, when the tab is focused, and live via Realtime
  useEffect(() => {
    fetchFromCloud();

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setData(mergePortfolio(JSON.parse(saved)));
        }
      } catch (e) {
        console.warn(e);
      }
    };

    const refreshFromCloud = () => {
      if (document.visibilityState !== 'visible') return;
      if (window.location.pathname.startsWith('/admin')) return;
      void fetchFromCloud();
    };

    window.addEventListener(UPDATE_EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', refreshFromCloud);
    document.addEventListener('visibilitychange', refreshFromCloud);

    const client = getSupabaseClient();
    const channel = client
      ?.channel('portfolio-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_content', filter: 'id=eq.main' },
        (payload) => {
          const row = payload.new as { data?: Partial<PortfolioDataType>; updated_at?: string } | undefined;
          if (!row?.data) return;
          const merged = mergePortfolio(row.data);
          setData(merged);
          persistLocal(merged);
          setIsCloudSynced(true);
          setCloudStatusText('Live update from Supabase');
          if (row.updated_at) {
            setLastSaved(new Date(row.updated_at).toISOString());
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener(UPDATE_EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', refreshFromCloud);
      document.removeEventListener('visibilitychange', refreshFromCloud);
      if (client && channel) {
        void client.removeChannel(channel);
      }
    };
  }, [fetchFromCloud]);

  // Save portfolio data (Local + Cloud)
  const savePortfolioData = useCallback(
    async (newData: PortfolioDataType): Promise<{ success: boolean; error?: string }> => {
      setIsSaving(true);

      setData(newData);
      persistLocal(newData);
      setLastSaved(new Date().toISOString());
      window.dispatchEvent(new Event(UPDATE_EVENT_NAME));

      const client = getSupabaseClient();
      if (!client) {
        setIsSaving(false);
        setIsCloudSynced(false);
        setCloudStatusText('Saved locally. Supabase is not connected.');
        return {
          success: false,
          error: 'Saved in this browser only. Connect Supabase to publish to the live website.',
        };
      }

      try {
        const { error } = await client.from('portfolio_content').upsert(
          {
            id: 'main',
            data: newData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (error) {
          console.warn('Supabase upsert error:', error);
          setIsSaving(false);
          setIsCloudSynced(false);
          setCloudStatusText(`Saved locally, but Supabase error: ${error.message}`);
          return {
            success: false,
            error: `Not published live: ${error.message}`,
          };
        }

        setIsSaving(false);
        setIsCloudSynced(true);
        setCloudStatusText('Published live to the public website');
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setIsSaving(false);
        setIsCloudSynced(false);
        setCloudStatusText(`Saved locally, cloud error: ${msg}`);
        return {
          success: false,
          error: `Not published live: ${msg}`,
        };
      }
    },
    []
  );

  // Upload resume file and update state
  const uploadResume = useCallback(
    async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
      setIsSaving(true);

      // Try uploading to Supabase Storage if configured
      if (isSupabaseConfigured()) {
        const uploadRes = await uploadResumeToSupabase(file);
        if (uploadRes.success && uploadRes.url) {
          const updated: PortfolioDataType = {
            ...dataRef.current,
            resume: {
              pdfUrl: uploadRes.url,
              exists: true,
            },
          };
          const saved = await savePortfolioData(updated);
          setIsSaving(false);
          return {
            success: saved.success,
            url: uploadRes.url,
            error: saved.error,
          };
        } else {
          console.warn('Supabase storage upload failed:', uploadRes.error);
        }
      }

      // Fallback: If Supabase Storage is not set up or failed, create local object URL / persistent base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Url = reader.result as string;
          const updated: PortfolioDataType = {
            ...dataRef.current,
            resume: {
              pdfUrl: base64Url,
              exists: true,
            },
          };
          const saved = await savePortfolioData(updated);
          setIsSaving(false);
          resolve({
            success: saved.success,
            url: base64Url,
            error: saved.error
              || (isSupabaseConfigured()
                ? 'Stored using direct data encoding. Create "resumes" bucket in Supabase for public CDN hosting.'
                : 'Stored in local storage. Connect Supabase Storage for permanent CDN hosting.'),
          });
        };
        reader.onerror = () => {
          setIsSaving(false);
          resolve({ success: false, error: 'Failed to read resume file.' });
        };
        reader.readAsDataURL(file);
      });
    },
    [savePortfolioData]
  );

  // Upload an asset (photo, image) to Supabase Storage
  const uploadAsset = useCallback(
    async (file: File, folder = 'images'): Promise<{ success: boolean; url?: string; error?: string }> => {
      if (isSupabaseConfigured()) {
        const res = await uploadAssetToSupabase(file, folder);
        if (res.success && res.url) {
          return res;
        }
      }

      // Fallback: Read as base64 data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, error: 'Failed to read file.' });
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  // Reset to default portfolio data
  const resetToDefaultData = useCallback(async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setData(defaultPortfolioData);
    setLastSaved(null);
    window.dispatchEvent(new Event(UPDATE_EVENT_NAME));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('portfolio_content').upsert(
          {
            id: 'main',
            data: defaultPortfolioData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
        setIsCloudSynced(true);
        setCloudStatusText('Reset to defaults and synced with Supabase');
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        isCloudSynced,
        cloudStatusText,
        lastSaved,
        savePortfolioData,
        uploadResume,
        uploadAsset,
        resetToDefaultData,
        fetchFromCloud,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
