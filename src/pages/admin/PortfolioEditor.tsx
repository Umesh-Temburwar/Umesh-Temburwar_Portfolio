import React, { useState } from 'react';
import {
  Save,
  RefreshCw,
  RotateCcw,
  ExternalLink,
  Upload,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Copy,
  Database,
  User,
  FolderGit2,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Menu,
  BookOpen,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem } from '../../data/portfolio';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
} from '../../lib/supabase';

type SubTab =
  | 'navbar'
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'contact'
  | 'resume'
  | 'supabase';

const defaultNavItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export const PortfolioEditor: React.FC = () => {
  const {
    data,
    savePortfolioData,
    uploadResume,
    uploadAsset,
    resetToDefaultData,
    fetchFromCloud,
    isCloudSynced,
    cloudStatusText,
    isSaving,
    lastSaved,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('navbar');
  const [formData, setFormData] = useState(data);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Photo / Asset upload state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    const res = await uploadAsset(file, 'avatars');
    if (res.success && res.url) {
      const newUrl = res.url;
      setFormData((prev) => ({
        ...prev,
        navbar: {
          brandName: prev.navbar?.brandName ?? prev.hero.name,
          brandRole: prev.navbar?.brandRole ?? prev.hero.role,
          avatarUrl: newUrl,
          ctaText: prev.navbar?.ctaText ?? "Let's talk",
          ctaLink: prev.navbar?.ctaLink ?? "/contact",
          items: prev.navbar?.items ?? defaultNavItems,
        },
        hero: {
          ...prev.hero,
          profilePhoto: newUrl,
        },
      }));
      setSaveStatus({
        type: 'success',
        message: 'Avatar uploaded to Supabase Storage and applied!',
      });
    } else {
      setSaveStatus({
        type: 'error',
        message: res.error || 'Failed to upload image.',
      });
    }
    setIsUploadingPhoto(false);
  };

  // Navbar editing state
  const [newNavLink, setNewNavLink] = useState({ name: '', href: '' });

  // Resume state
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Projects editing state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectItem | null>(null);
  const [newTechTag, setNewTechTag] = useState('');

  // Skills editing state
  const [newSkillTag, setNewSkillTag] = useState<{ [category: string]: string }>({});
  const [newCategoryName, setNewCategoryName] = useState('');

  // Education competency state
  const [newCompetencyTag, setNewCompetencyTag] = useState<{ [eduIdx: number]: string }>({});

  // Supabase credentials state
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseCredentials().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseCredentials().anonKey);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Update local formData whenever data changes from context
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  // Handle Save
  const handleSaveAll = async () => {
    setSaveStatus(null);
    const result = await savePortfolioData(formData);
    if (result.success) {
      setSaveStatus({
        type: 'success',
        message: result.error
          ? result.error
          : 'All changes saved and published live to your website!',
      });
      setTimeout(() => setSaveStatus(null), 5000);
    } else {
      setSaveStatus({
        type: 'error',
        message: result.error || 'Failed to save changes.',
      });
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeFile) return;

    setIsUploadingResume(true);
    setSaveStatus(null);
    try {
      const res = await uploadResume(selectedResumeFile);
      if (res.success) {
        setSaveStatus({
          type: 'success',
          message: 'Resume PDF uploaded and live link updated successfully!',
        });
        setSelectedResumeFile(null);
      } else {
        setSaveStatus({
          type: 'error',
          message: res.error || 'Failed to upload resume.',
        });
      }
    } catch (err: unknown) {
      setSaveStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error uploading resume.',
      });
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Handle Project modal/form save
  const handleSaveProject = () => {
    if (!projectForm) return;

    if (!projectForm.title.trim()) {
      alert('Project title is required.');
      return;
    }

    const updatedProjects = [...formData.projects];
    const existingIndex = updatedProjects.findIndex((p) => p.id === projectForm.id);

    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = projectForm;
    } else {
      updatedProjects.unshift({
        ...projectForm,
        id: projectForm.id || `project-${Date.now()}`,
      });
    }

    const updatedData = { ...formData, projects: updatedProjects };
    setFormData(updatedData);
    savePortfolioData(updatedData);
    setEditingProjectId(null);
    setProjectForm(null);
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const updatedProjects = formData.projects.filter((p) => p.id !== id);
    const updatedData = { ...formData, projects: updatedProjects };
    setFormData(updatedData);
    savePortfolioData(updatedData);
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.projects.length) return;

    const list = [...formData.projects];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const updatedData = { ...formData, projects: list };
    setFormData(updatedData);
    savePortfolioData(updatedData);
  };

  // Test Supabase connection
  const handleTestConnection = async () => {
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    setIsTestingConnection(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTestingConnection(false);
    if (res.success) {
      fetchFromCloud();
    }
  };

  // Copy SQL Schema
  const handleCopySql = () => {
    const sql = `-- ==============================================================================
-- SUPABASE COMPLETE DATABASE SETUP FOR UMESH TEMBURWAR PORTFOLIO
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Helper trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Portfolio content table (Core CMS)
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_portfolio_content_updated_at ON public.portfolio_content;
CREATE TRIGGER trigger_portfolio_content_updated_at
  BEFORE UPDATE ON public.portfolio_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Portfolio Content" ON public.portfolio_content;
CREATE POLICY "Public Read Portfolio Content" ON public.portfolio_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow All Upsert Portfolio Content" ON public.portfolio_content;
CREATE POLICY "Allow All Upsert Portfolio Content" ON public.portfolio_content FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.portfolio_content (id, data, updated_at)
VALUES ('main', '{}'::jsonb, timezone('utc'::text, now()))
ON CONFLICT (id) DO NOTHING;

-- 3. Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone Can Submit Contact Message" ON public.contact_messages;
CREATE POLICY "Anyone Can Submit Contact Message" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Read Contact Messages" ON public.contact_messages;
CREATE POLICY "Read Contact Messages" ON public.contact_messages FOR SELECT USING (true);

-- 4. Storage buckets & policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', true, 10485760, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('portfolio-assets', 'portfolio-assets', true, 10485760)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Resumes Bucket" ON storage.objects;
CREATE POLICY "Public Read Resumes Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow Upload to Resumes Bucket" ON storage.objects;
CREATE POLICY "Allow Upload to Resumes Bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow Update in Resumes Bucket" ON storage.objects;
CREATE POLICY "Allow Update in Resumes Bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow Delete from Resumes Bucket" ON storage.objects;
CREATE POLICY "Allow Delete from Resumes Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Public Read Portfolio Assets" ON storage.objects;
CREATE POLICY "Public Read Portfolio Assets" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Allow Upload to Portfolio Assets" ON storage.objects;
CREATE POLICY "Allow Upload to Portfolio Assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

-- 5. PostgREST permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Live Control Bar */}
      <div className="bg-surface border border-border p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-3 h-3 rounded-full ${
                isCloudSynced ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
            <h2 className="text-xl font-bold uppercase tracking-tight text-textMain">
              Live Website CMS & Control Center
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-background border border-border text-textMuted">
              {isCloudSynced ? 'Supabase Connected' : 'Local Storage Mode'}
            </span>
          </div>
          <p className="text-xs font-mono text-textMuted">{cloudStatusText}</p>
          {lastSaved && (
            <p className="text-[11px] font-mono text-primary mt-1">
              Last saved live at {lastSaved}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Live Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 border border-border hover:border-primary text-textMain font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
            title="Open live website in a new tab"
          >
            <ExternalLink size={14} /> View Live Site
          </a>

          {/* Sync from Cloud */}
          <button
            type="button"
            onClick={() => fetchFromCloud()}
            className="px-3.5 py-2 border border-border hover:border-primary text-textMuted hover:text-textMain font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
            title="Fetch latest from Supabase"
          >
            <RefreshCw size={14} /> Sync Cloud
          </button>

          {/* Save All Changes */}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-background font-mono text-xs uppercase tracking-widest font-bold rounded shadow transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Live Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Status Notification */}
      {saveStatus && (
        <div
          className={`p-4 rounded-lg border text-xs font-mono flex items-center justify-between ${
            saveStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {saveStatus.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-400" />
            ) : (
              <AlertCircle size={16} className="text-rose-400" />
            )}
            <span>{saveStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveStatus(null)}
            className="text-textMuted hover:text-textMain ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { id: 'navbar', label: '1. Navbar & Brand', icon: Menu },
          { id: 'hero', label: '2. Hero & Bio', icon: User },
          { id: 'about', label: '3. About & Metrics', icon: BookOpen },
          { id: 'skills', label: '4. Skills & Tech', icon: Layers },
          { id: 'projects', label: '5. Projects', icon: FolderGit2 },
          { id: 'experience', label: '6. Experience', icon: Briefcase },
          { id: 'education', label: '7. Education', icon: GraduationCap },
          { id: 'certifications', label: '8. Certifications', icon: Award },
          { id: 'contact', label: '9. Contact & Footer', icon: Mail },
          { id: 'resume', label: '10. Resume PDF', icon: FileText },
          { id: 'supabase', label: '11. Cloud Database', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-background font-bold shadow-sm'
                  : 'bg-background border border-border text-textMuted hover:text-textMain hover:border-primary/50'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: NAVBAR & BRANDING */}
      {activeSubTab === 'navbar' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <Menu className="text-primary" size={20} />
              Navigation Bar & Header Branding
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Controls the floating navbar branding, round logo/avatar, engineer title, call-to-action button, and navigation links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Brand Display Name
              </label>
              <input
                type="text"
                value={formData.navbar?.brandName ?? formData.hero.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    navbar: {
                      brandName: e.target.value,
                      brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                      avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                      ctaText: formData.navbar?.ctaText ?? "Let's talk",
                      ctaLink: formData.navbar?.ctaLink ?? "/contact",
                      items: formData.navbar?.items ?? defaultNavItems,
                    },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
                placeholder="e.g. Umesh Temburwar"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Brand Role Tagline (Orange Subtitle)
              </label>
              <input
                type="text"
                value={formData.navbar?.brandRole ?? formData.hero.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    navbar: {
                      brandName: formData.navbar?.brandName ?? formData.hero.name,
                      brandRole: e.target.value,
                      avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                      ctaText: formData.navbar?.ctaText ?? "Let's talk",
                      ctaLink: formData.navbar?.ctaLink ?? "/contact",
                      items: formData.navbar?.items ?? defaultNavItems,
                    },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
                placeholder="e.g. Computer Science Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Avatar Image URL (Navbar Round Logo)
              </label>
              <input
                type="text"
                value={formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    navbar: {
                      brandName: formData.navbar?.brandName ?? formData.hero.name,
                      brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                      avatarUrl: e.target.value,
                      ctaText: formData.navbar?.ctaText ?? "Let's talk",
                      ctaLink: formData.navbar?.ctaLink ?? "/contact",
                      items: formData.navbar?.items ?? defaultNavItems,
                    },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
                placeholder="/umesh.jpg or image URL"
              />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[10px] font-mono text-textMuted">Presets:</span>
                {['/umesh.jpg', '/umesh-clean-hd.png', '/umesh-colorful.png', '/umesh-cutout.png'].map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        navbar: {
                          brandName: formData.navbar?.brandName ?? formData.hero.name,
                          brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                          avatarUrl: img,
                          ctaText: formData.navbar?.ctaText ?? "Let's talk",
                          ctaLink: formData.navbar?.ctaLink ?? "/contact",
                          items: formData.navbar?.items ?? defaultNavItems,
                        },
                      })
                    }
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border hover:border-primary text-textMuted hover:text-textMain cursor-pointer"
                  >
                    {img.replace('/', '')}
                  </button>
                ))}

                <label className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 cursor-pointer flex items-center gap-1">
                  <Upload size={11} className={isUploadingPhoto ? 'animate-spin' : ''} />
                  <span>{isUploadingPhoto ? 'Uploading to Supabase...' : 'Upload Custom Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Navbar Right CTA Button Text & Target
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.navbar?.ctaText ?? "Let's talk"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      navbar: {
                        brandName: formData.navbar?.brandName ?? formData.hero.name,
                        brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                        avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                        ctaText: e.target.value,
                        ctaLink: formData.navbar?.ctaLink ?? "/contact",
                        items: formData.navbar?.items ?? defaultNavItems,
                      },
                    })
                  }
                  className="bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
                  placeholder="Button Text"
                />
                <input
                  type="text"
                  value={formData.navbar?.ctaLink ?? "/contact"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      navbar: {
                        brandName: formData.navbar?.brandName ?? formData.hero.name,
                        brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                        avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                        ctaText: formData.navbar?.ctaText ?? "Let's talk",
                        ctaLink: e.target.value,
                        items: formData.navbar?.items ?? defaultNavItems,
                      },
                    })
                  }
                  className="bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
                  placeholder="Destination (e.g. /contact or #contact)"
                />
              </div>
            </div>
          </div>

          {/* Navigation Links Management */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase text-primary font-bold">
                Navigation Menu Links (In Order of Appearance)
              </h4>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    navbar: {
                      brandName: formData.navbar?.brandName ?? formData.hero.name,
                      brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                      avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                      ctaText: formData.navbar?.ctaText ?? "Let's talk",
                      ctaLink: formData.navbar?.ctaLink ?? "/contact",
                      items: defaultNavItems,
                    },
                  });
                }}
                className="text-[10px] font-mono text-textMuted hover:text-primary underline cursor-pointer"
              >
                Reset to Default Sequence
              </button>
            </div>

            <div className="space-y-2">
              {(formData.navbar?.items ?? defaultNavItems).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-background border border-border rounded">
                  <span className="font-mono text-xs text-textMuted w-6 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...(formData.navbar?.items ?? defaultNavItems)];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setFormData({
                        ...formData,
                        navbar: {
                          brandName: formData.navbar?.brandName ?? formData.hero.name,
                          brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                          avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                          ctaText: formData.navbar?.ctaText ?? "Let's talk",
                          ctaLink: formData.navbar?.ctaLink ?? "/contact",
                          items: updated,
                        },
                      });
                    }}
                    className="flex-1 bg-surface border border-border text-xs font-mono p-1.5 rounded focus:border-primary focus:outline-none"
                    placeholder="Link Name"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => {
                      const updated = [...(formData.navbar?.items ?? defaultNavItems)];
                      updated[idx] = { ...updated[idx], href: e.target.value };
                      setFormData({
                        ...formData,
                        navbar: {
                          brandName: formData.navbar?.brandName ?? formData.hero.name,
                          brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                          avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                          ctaText: formData.navbar?.ctaText ?? "Let's talk",
                          ctaLink: formData.navbar?.ctaLink ?? "/contact",
                          items: updated,
                        },
                      });
                    }}
                    className="w-40 bg-surface border border-border text-xs font-mono p-1.5 rounded focus:border-primary focus:outline-none"
                    placeholder="#section or URL"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.navbar?.items ?? defaultNavItems).filter((_, i) => i !== idx);
                      setFormData({
                        ...formData,
                        navbar: {
                          brandName: formData.navbar?.brandName ?? formData.hero.name,
                          brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                          avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                          ctaText: formData.navbar?.ctaText ?? "Let's talk",
                          ctaLink: formData.navbar?.ctaLink ?? "/contact",
                          items: updated,
                        },
                      });
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-600 rounded cursor-pointer"
                    title="Delete link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Link */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={newNavLink.name}
                onChange={(e) => setNewNavLink({ ...newNavLink, name: e.target.value })}
                placeholder="New Link Name (e.g. Blog, Testimonials)"
                className="flex-1 bg-background border border-border text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={newNavLink.href}
                onChange={(e) => setNewNavLink({ ...newNavLink, href: e.target.value })}
                placeholder="Target URL (e.g. #blog or /blog)"
                className="w-48 bg-background border border-border text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newNavLink.name.trim() || !newNavLink.href.trim()) return;
                  const current = formData.navbar?.items ?? defaultNavItems;
                  setFormData({
                    ...formData,
                    navbar: {
                      brandName: formData.navbar?.brandName ?? formData.hero.name,
                      brandRole: formData.navbar?.brandRole ?? formData.hero.role,
                      avatarUrl: formData.navbar?.avatarUrl ?? formData.hero.profilePhoto ?? '/umesh.jpg',
                      ctaText: formData.navbar?.ctaText ?? "Let's talk",
                      ctaLink: formData.navbar?.ctaLink ?? "/contact",
                      items: [...current, { name: newNavLink.name.trim(), href: newNavLink.href.trim() }],
                    },
                  });
                  setNewNavLink({ name: '', href: '' });
                }}
                className="px-3.5 py-2 bg-primary text-background font-mono text-xs uppercase font-bold rounded flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: RESUME UPDATE */}
      {activeSubTab === 'resume' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              Live Resume File & PDF Management
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Any changes made here instantly reflect on the "View Resume" button, `/resume` page, and Download PDF links.
            </p>
          </div>

          {/* Current Live Resume Info */}
          <div className="p-4 rounded border border-border bg-background space-y-3">
            <div className="text-xs font-mono text-textMuted uppercase tracking-wider">
              Current Active Resume PDF:
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="font-mono text-sm text-textMain truncate">
                <span className="text-primary font-bold">URL: </span>
                <span className="select-all">{formData.resume.pdfUrl || 'No file configured'}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={formData.resume.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-border hover:border-primary text-xs font-mono uppercase rounded flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={13} /> View Current PDF
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.resume.exists}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, exists: e.target.checked },
                    })
                  }
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-xs font-mono text-textMain">
                  Enable Resume on Website (If unchecked, shows "Resume Unavailable")
                </span>
              </label>
            </div>
          </div>

          {/* Upload New Resume PDF Form */}
          <form onSubmit={handleResumeUpload} className="p-5 border border-border rounded bg-background/50 space-y-4">
            <h4 className="text-xs font-mono uppercase text-primary tracking-widest font-bold flex items-center gap-2">
              <Upload size={14} /> Upload New Resume File (PDF)
            </h4>
            <p className="text-xs text-textMuted font-mono">
              Upload your updated resume PDF. It will automatically upload to Supabase Storage (or persistent storage) and update the live website immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setSelectedResumeFile(e.target.files?.[0] || null)}
                className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-mono file:bg-surface file:text-textMain hover:file:bg-primary hover:file:text-background cursor-pointer border border-border p-2 rounded"
              />
              <button
                type="submit"
                disabled={!selectedResumeFile || isUploadingResume}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-background font-mono text-xs uppercase tracking-widest font-bold rounded disabled:opacity-40 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
              >
                {isUploadingResume ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Upload & Set Live</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Or Manual URL Input */}
          <div className="p-4 border border-border rounded bg-background/30 space-y-3">
            <h4 className="text-xs font-mono uppercase text-textMain tracking-widest font-bold">
              Or Enter Direct Resume URL / Path:
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.resume.pdfUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resume: { ...formData.resume, pdfUrl: e.target.value },
                  })
                }
                placeholder="/Umesh-Temburwar-OCT.pdf or https://..."
                className="flex-1 bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-4 py-2.5 bg-surface border border-border hover:border-primary text-textMain font-mono text-xs uppercase tracking-wider rounded transition-colors"
              >
                Save URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO & IDENTITY */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <User className="text-primary" size={20} />
              Hero Section & Personal Identity
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Controls the main hero banner, headline, subtitle, profile photo, and intro text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.hero.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, name: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Role / Specialty
              </label>
              <input
                type="text"
                value={formData.hero.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, role: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Full Headline / Title
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.hero.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Profile Photo URL / Path
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.hero.profilePhoto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, profilePhoto: e.target.value },
                    })
                  }
                  className="flex-1 bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
                  placeholder="/umesh.jpg or Supabase image URL"
                />
                <label className="px-3 py-2.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 cursor-pointer flex items-center gap-1.5 text-xs font-mono shrink-0">
                  <Upload size={12} className={isUploadingPhoto ? 'animate-spin' : ''} />
                  <span>{isUploadingPhoto ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                </label>
                {formData.hero.profilePhoto && (
                  <img
                    src={formData.hero.profilePhoto}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded border border-border shrink-0"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                ID Card Line 1
              </label>
              <input
                type="text"
                value={formData.hero.idCard?.line1 || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: {
                      ...formData.hero,
                      idCard: {
                        line1: e.target.value,
                        line2: formData.hero.idCard?.line2 || '',
                      },
                    },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                ID Card Line 2 (Location)
              </label>
              <input
                type="text"
                value={formData.hero.idCard?.line2 || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: {
                      ...formData.hero,
                      idCard: {
                        line1: formData.hero.idCard?.line1 || '',
                        line2: e.target.value,
                      },
                    },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Hero Description / Pitch
              </label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

          </div>
        </div>
      )}

      {/* TAB: ABOUT ME & METRICS */}
      {activeSubTab === 'about' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              About Me & Impact Metrics
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Controls Section 01: About Me, philosophy quote, full bio statement, and the 4 impact metric cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={formData.about.title || 'About Me'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, title: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={formData.about.subtitle || 'THE PERSON BEHIND THE WORK'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, subtitle: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Main Italic Philosophy / Intro Quote
              </label>
              <textarea
                rows={3}
                value={formData.about.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, content: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Detailed Professional Bio Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.about.bio || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, bio: e.target.value },
                  })
                }
                placeholder="Detailed bio paragraph..."
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* 4 Impact Metrics */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-mono uppercase text-primary font-bold mb-3">
              Impact Metric Strip Cards (4 Cards)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {(formData.about.metrics || [
                { value: "3+", label: "Years Building & Coding" },
                { value: "10+", label: "Full-Stack & AI Projects" },
                { value: "2,000+", label: "ByteFest Daily Visitors" },
                { value: "THE WORK", label: "REAL-WORLD IMPACT." }
              ]).map((metric, idx) => (
                <div key={idx} className="p-3 bg-background border border-border rounded space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold">Metric #{idx + 1}</span>
                  <div>
                    <label className="text-[10px] font-mono text-textMuted block">Number / Value</label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => {
                        const current = [...(formData.about.metrics || [
                          { value: "3+", label: "Years Building & Coding" },
                          { value: "10+", label: "Full-Stack & AI Projects" },
                          { value: "2,000+", label: "ByteFest Daily Visitors" },
                          { value: "THE WORK", label: "REAL-WORLD IMPACT." }
                        ])];
                        current[idx] = { ...current[idx], value: e.target.value };
                        setFormData({
                          ...formData,
                          about: { ...formData.about, metrics: current },
                        });
                      }}
                      className="w-full bg-surface border border-border text-xs font-mono p-1.5 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-textMuted block">Label</label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => {
                        const current = [...(formData.about.metrics || [
                          { value: "3+", label: "Years Building & Coding" },
                          { value: "10+", label: "Full-Stack & AI Projects" },
                          { value: "2,000+", label: "ByteFest Daily Visitors" },
                          { value: "THE WORK", label: "REAL-WORLD IMPACT." }
                        ])];
                        current[idx] = { ...current[idx], label: e.target.value };
                        setFormData({
                          ...formData,
                          about: { ...formData.about, metrics: current },
                        });
                      }}
                      className="w-full bg-surface border border-border text-xs font-mono p-1.5 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS (FULL CRUD) */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
                <FolderGit2 className="text-primary" size={20} />
                Portfolio Projects Manager ({formData.projects.length} Total)
              </h3>
              <p className="text-xs text-textMuted font-mono mt-1">
                Add new projects, update GitHub/live links, descriptions, tech stacks, or delete projects.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setProjectForm({
                  id: `project-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  category: 'Full-Stack Development',
                  shortDescription: '',
                  description: '',
                  problem: '',
                  solution: '',
                  features: [],
                  architecture: '',
                  challenges: '',
                  tech: ['React', 'Node.js'],
                  status: 'Completed',
                  githubUrl: '',
                  liveUrl: '',
                  screenshots: [],
                  coverImage: '/placeholder.png',
                });
                setEditingProjectId('new');
              }}
              className="px-4 py-2 bg-primary text-background font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center gap-1.5 self-start sm:self-auto hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} /> Add New Project
            </button>
          </div>

          {/* Project List */}
          <div className="space-y-3">
            {formData.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-4 rounded border border-border bg-background flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {proj.coverImage && (
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-16 h-12 object-cover rounded border border-border flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary font-bold">
                        #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-textMain truncate">
                        {proj.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-textMuted">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-textMuted font-mono line-clamp-1 mt-1">
                      {proj.shortDescription || proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.tech.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface text-textMuted"
                        >
                          {t}
                        </span>
                      ))}
                      {proj.tech.length > 5 && (
                        <span className="text-[10px] font-mono text-textMuted">
                          +{proj.tech.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  {/* Reorder */}
                  <button
                    type="button"
                    onClick={() => handleMoveProject(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded border border-border hover:border-primary text-textMuted hover:text-textMain disabled:opacity-30"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveProject(idx, 'down')}
                    disabled={idx === formData.projects.length - 1}
                    className="p-1.5 rounded border border-border hover:border-primary text-textMuted hover:text-textMain disabled:opacity-30"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => {
                      setProjectForm({ ...proj });
                      setEditingProjectId(proj.id);
                    }}
                    className="px-3 py-1.5 rounded border border-border hover:border-primary text-xs font-mono uppercase text-textMain flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 rounded border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Project Edit / Create Modal */}
          {editingProjectId && projectForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
              <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4 my-8">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-base font-bold uppercase text-textMain">
                    {editingProjectId === 'new' ? 'Add New Project' : `Edit: ${projectForm.title}`}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm(null);
                    }}
                    className="text-textMuted hover:text-textMain"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      placeholder="Completed / In Progress"
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Subtitle / Role
                    </label>
                    <input
                      type="text"
                      value={projectForm.subtitle || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={projectForm.category || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Live Demo URL
                    </label>
                    <input
                      type="text"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={projectForm.coverImage}
                      onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Short Summary Description
                    </label>
                    <input
                      type="text"
                      value={projectForm.shortDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Full Description
                    </label>
                    <textarea
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full bg-background border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Tech stack tags */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                      Technologies Used
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {projectForm.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono bg-background border border-border px-2 py-0.5 rounded flex items-center gap-1"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() =>
                              setProjectForm({
                                ...projectForm,
                                tech: projectForm.tech.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-rose-400 hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTechTag}
                        onChange={(e) => setNewTechTag(e.target.value)}
                        placeholder="Add technology (e.g. Next.js, Docker)"
                        className="flex-1 bg-background border border-border text-textMain text-xs font-mono p-1.5 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTechTag.trim()) {
                            setProjectForm({
                              ...projectForm,
                              tech: [...projectForm.tech, newTechTag.trim()],
                            });
                            setNewTechTag('');
                          }
                        }}
                        className="px-3 py-1.5 bg-surface border border-border hover:border-primary text-xs font-mono"
                      >
                        Add Tech
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm(null);
                    }}
                    className="px-4 py-2 border border-border text-textMuted hover:text-textMain text-xs font-mono uppercase rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProject}
                    className="px-6 py-2 bg-primary text-background font-mono text-xs uppercase tracking-wider font-bold rounded"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SKILLS & TECH */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <Layers className="text-primary" size={20} />
              Core Technical Skills & Categories
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Add or remove skills in each category, or add a brand new category.
            </p>
          </div>

          <div className="space-y-4">
            {formData.skills.core.map((cat, catIdx) => (
              <div key={catIdx} className="p-4 rounded border border-border bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-primary uppercase">
                    {cat.category}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete category "${cat.category}"?`)) {
                        const updated = formData.skills.core.filter((_, i) => i !== catIdx);
                        setFormData({
                          ...formData,
                          skills: { ...formData.skills, core: updated },
                        });
                      }
                    }}
                    className="text-textMuted hover:text-rose-400 text-xs"
                    title="Delete category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-mono bg-surface border border-border px-2.5 py-1 rounded flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.skills.core];
                          updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== sIdx);
                          setFormData({
                            ...formData,
                            skills: { ...formData.skills, core: updated },
                          });
                        }}
                        className="text-textMuted hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add skill input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkillTag[cat.category] || ''}
                    onChange={(e) =>
                      setNewSkillTag({ ...newSkillTag, [cat.category]: e.target.value })
                    }
                    placeholder={`Add skill to ${cat.category}...`}
                    className="bg-surface border border-border text-textMain text-xs font-mono p-1.5 rounded flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = (newSkillTag[cat.category] || '').trim();
                      if (val) {
                        const updated = [...formData.skills.core];
                        updated[catIdx].items.push(val);
                        setFormData({
                          ...formData,
                          skills: { ...formData.skills, core: updated },
                        });
                        setNewSkillTag({ ...newSkillTag, [cat.category]: '' });
                      }
                    }}
                    className="px-3 py-1.5 bg-surface border border-border hover:border-primary text-xs font-mono"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Category */}
            <div className="p-4 rounded border border-dashed border-border bg-background/40 flex items-center gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name (e.g. Cloud & DevOps)"
                className="bg-background border border-border text-textMain text-xs font-mono p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategoryName.trim()) {
                    setFormData({
                      ...formData,
                      skills: {
                        ...formData.skills,
                        core: [
                          ...formData.skills.core,
                          { category: newCategoryName.trim(), items: [] },
                        ],
                      },
                    });
                    setNewCategoryName('');
                  }
                }}
                className="px-4 py-2 bg-primary text-background font-mono text-xs uppercase font-bold rounded"
              >
                + Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPERIENCE */}
      {activeSubTab === 'experience' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
                <Briefcase className="text-primary" size={20} />
                Work & Leadership Experience
              </h3>
              <p className="text-xs text-textMuted font-mono mt-1">
                Edit existing roles or add professional experience entries.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  experience: [
                    ...formData.experience,
                    {
                      role: 'New Role',
                      company: 'Company Name',
                      location: 'City, State',
                      duration: '2025 - Present',
                      description: 'Role overview...',
                      highlights: ['Key contribution 1', 'Key contribution 2'],
                    },
                  ],
                });
              }}
              className="px-3.5 py-1.5 bg-primary text-background font-mono text-xs uppercase font-bold rounded flex items-center gap-1"
            >
              <Plus size={13} /> Add Experience
            </button>
          </div>

          <div className="space-y-4">
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">
                    Experience #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.experience.filter((_, i) => i !== idx);
                      setFormData({ ...formData, experience: updated });
                    }}
                    className="text-rose-400 hover:text-rose-600 text-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Role Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].role = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].company = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].duration = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const updated = [...formData.experience];
                        updated[idx].location = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-textMuted">Description</label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...formData.experience];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, experience: updated });
                    }}
                    className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EDUCATION */}
      {activeSubTab === 'education' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
                <GraduationCap className="text-primary" size={20} />
                Education & Academics
              </h3>
              <p className="text-xs text-textMuted font-mono mt-1">
                Degree, college, CGPA, and graduation dates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  education: [
                    ...formData.education,
                    {
                      degree: 'Degree Name',
                      institution: 'College / University',
                      location: 'City, State',
                      duration: '2022 - 2026',
                      cgpa: '6.06',
                      degreeType: 'Bachelor of Technology (B.Tech)',
                      coreFocus: 'Focusing on Computer Science fundamentals: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, and Full-Stack Engineering.',
                      competencies: ['Data Structures', 'Algorithms', 'DBMS & SQL', 'Operating Systems', 'Computer Networks', 'OOP', 'Full-Stack Web Dev', 'REST APIs'],
                    },
                  ],
                });
              }}
              className="px-3.5 py-1.5 bg-primary text-background font-mono text-xs uppercase font-bold rounded flex items-center gap-1"
            >
              <Plus size={13} /> Add Education
            </button>
          </div>

          <div className="space-y-4">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">
                    Education #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.education.filter((_, i) => i !== idx);
                      setFormData({ ...formData, education: updated });
                    }}
                    className="text-rose-400 hover:text-rose-600 text-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Degree Type Badge</label>
                    <input
                      type="text"
                      value={edu.degreeType || 'Bachelor of Technology (B.Tech)'}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].degreeType = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      placeholder="e.g. Bachelor of Technology (B.Tech)"
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Degree Title</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].degree = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].institution = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Location</label>
                    <input
                      type="text"
                      value={edu.location || 'Ambajogai, Maharashtra'}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].location = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Duration</label>
                    <input
                      type="text"
                      value={edu.duration}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].duration = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">CGPA / Score</label>
                    <input
                      type="text"
                      value={edu.cgpa || ''}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].cgpa = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      placeholder="e.g. 6.06 / 10"
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-textMuted">Core Focus & Fundamentals</label>
                    <textarea
                      rows={2}
                      value={edu.coreFocus || ''}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].coreFocus = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      placeholder="Focusing on Computer Science fundamentals..."
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-textMuted block mb-1">
                      Key Competencies Developed
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(edu.competencies || ["Data Structures", "Algorithms", "DBMS & SQL", "Operating Systems", "Computer Networks", "OOP", "Full-Stack Web Dev", "REST APIs"]).map((comp, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 rounded bg-background border border-border text-xs font-mono flex items-center gap-1 text-zinc-300">
                          <span>{comp}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.education];
                              const currentComps = updated[idx].competencies || ["Data Structures", "Algorithms", "DBMS & SQL", "Operating Systems", "Computer Networks", "OOP", "Full-Stack Web Dev", "REST APIs"];
                              updated[idx].competencies = currentComps.filter((_, i) => i !== cIdx);
                              setFormData({ ...formData, education: updated });
                            }}
                            className="text-rose-400 hover:text-rose-600 cursor-pointer ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCompetencyTag[idx] || ''}
                        onChange={(e) =>
                          setNewCompetencyTag({
                            ...newCompetencyTag,
                            [idx]: e.target.value,
                          })
                        }
                        placeholder="Add new competency tag..."
                        className="bg-surface border border-border text-xs font-mono p-1.5 rounded flex-1 focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const tag = (newCompetencyTag[idx] || '').trim();
                          if (!tag) return;
                          const updated = [...formData.education];
                          const currentComps = updated[idx].competencies || ["Data Structures", "Algorithms", "DBMS & SQL", "Operating Systems", "Computer Networks", "OOP", "Full-Stack Web Dev", "REST APIs"];
                          updated[idx].competencies = [...currentComps, tag];
                          setFormData({ ...formData, education: updated });
                          setNewCompetencyTag({ ...newCompetencyTag, [idx]: '' });
                        }}
                        className="px-3 py-1.5 bg-primary text-background font-mono text-xs uppercase font-bold rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CERTIFICATIONS */}
      {activeSubTab === 'certifications' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
                <Award className="text-primary" size={20} />
                Certifications & Achievements ({formData.certifications.length})
              </h3>
              <p className="text-xs text-textMuted font-mono mt-1">
                AWS, freeCodeCamp, Cisco, and technical certifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  certifications: [
                    ...formData.certifications,
                    {
                      title: 'New Certification',
                      issuer: 'Certifying Organization',
                      date: '2025',
                      link: '',
                      image: '/placeholder-cert.png',
                      hasPdf: false,
                    },
                  ],
                });
              }}
              className="px-3.5 py-1.5 bg-primary text-background font-mono text-xs uppercase font-bold rounded flex items-center gap-1"
            >
              <Plus size={13} /> Add Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.certifications.map((cert, idx) => (
              <div key={idx} className="p-4 rounded border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">
                    Certificate #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.certifications.filter((_, i) => i !== idx);
                      setFormData({ ...formData, certifications: updated });
                    }}
                    className="text-rose-400 hover:text-rose-600 text-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-textMuted">Title</label>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, certifications: updated });
                    }}
                    className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Issuer</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...formData.certifications];
                        updated[idx].issuer = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-textMuted">Date</label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => {
                        const updated = [...formData.certifications];
                        updated[idx].date = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-textMuted">Credential / PDF Link</label>
                  <input
                    type="text"
                    value={cert.link}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      updated[idx].link = e.target.value;
                      setFormData({ ...formData, certifications: updated });
                    }}
                    className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: CONTACT & SOCIALS */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <Mail className="text-primary" size={20} />
              Contact Details, Section Content & Socials
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Controls Section 07: Initiate a Conversation banner, headline, contact email, phone, location, and social profile links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Section Tag / Number
              </label>
              <input
                type="text"
                value={formData.contact.tag || '■ 07 / INITIATE A CONVERSATION'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, tag: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Direct Contact Email
              </label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.contact.heading || "Let's build something exceptional together."}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, heading: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Section Description Subtext
              </label>
              <textarea
                rows={2}
                value={formData.contact.description || "Whether you have an engineering role opening, an ambitious full-stack project, or simply want to connect, my inbox is always open."}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, description: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Location Display
              </label>
              <input
                type="text"
                value={formData.hero.idCard?.line2 || 'Ambajogai, Maharashtra'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: {
                      ...formData.hero,
                      idCard: {
                        line1: formData.hero.idCard?.line1 || '',
                        line2: e.target.value,
                      },
                    },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={formData.hero.linkedinUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, linkedinUrl: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={formData.hero.githubUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, githubUrl: e.target.value },
                  })
                }
                className="w-full bg-background border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: SUPABASE CLOUD DB SETTINGS */}
      {activeSubTab === 'supabase' && (
        <div className="space-y-6 bg-surface border border-border p-6 rounded-lg">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-textMain flex items-center gap-2">
              <Database className="text-primary" size={20} />
              Supabase Cloud Database & Storage Configuration
            </h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              Connect your Supabase project so changes made by you persist globally in PostgreSQL and sync to all users worldwide.
            </p>
          </div>

          <div className="p-4 rounded border border-border bg-background space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Supabase Project URL (e.g. https://xyzcompany.supabase.co)
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-textMuted mb-1">
                Supabase Anon / Public Key (eyJhbGciOi...)
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full bg-surface border border-border text-textMain text-xs font-mono p-2.5 rounded focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection || !supabaseUrl || !supabaseKey}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-background font-mono text-xs uppercase font-bold rounded flex items-center gap-2 disabled:opacity-50"
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Database size={14} />
                    <span>Test & Save Credentials</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-4 py-2.5 border border-border hover:border-primary text-textMain font-mono text-xs uppercase rounded flex items-center gap-1.5 transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>SQL Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy SQL Schema Script</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded text-xs font-mono flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Quick Setup Instructions */}
          <div className="p-4 border border-border/80 rounded bg-background/50 space-y-2 text-xs font-mono text-textMuted">
            <span className="font-bold text-textMain uppercase tracking-wider">
              3-Step Supabase Setup Guide:
            </span>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your Supabase dashboard at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-primary underline">supabase.com</a>.</li>
              <li>Go to <strong>SQL Editor</strong>, click <strong>New Query</strong>, paste the copied SQL schema, and click <strong>Run</strong>.</li>
              <li>Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> from Project Settings → API, paste them above, and click <strong>Test & Save</strong>!</li>
            </ol>
          </div>

          {/* Reset to Defaults */}
          <div className="p-4 border border-rose-500/30 rounded bg-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-mono text-xs font-bold text-rose-400 uppercase">
                Reset Website to Factory Defaults
              </h5>
              <p className="text-[11px] font-mono text-textMuted">
                Discards all custom edits and restores the original code data from `src/data/portfolio.ts`.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Reset all website content back to default template?')) {
                  await resetToDefaultData();
                  setSaveStatus({
                    type: 'success',
                    message: 'Reset back to default template data.',
                  });
                }
              }}
              className="px-4 py-2 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-mono uppercase font-bold rounded flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
