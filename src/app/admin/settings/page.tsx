"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

interface SettingsForm {
  storeName: string;
  description: string;
  primaryColor: string;
  logo: string;
  favicon: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<SettingsForm>({
    storeName: "LuxGems & Tech",
    description: "",
    primaryColor: "#1a1a2e",
    logo: "",
    favicon: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          setForm({
            storeName: settings.storeName || "LuxGems & Tech",
            description: settings.description || "",
            primaryColor: settings.primaryColor || "#1a1a2e",
            logo: settings.logo || "",
            favicon: settings.favicon || "",
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Settings saved");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">
          Store Settings
        </h1>
        <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm text-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">
        Store Settings
      </h1>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#1a1a2e]">
              General Settings
            </h2>
            <Input
              label="Store Name"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]"
                placeholder="Store description for SEO and meta tags..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={form.primaryColor}
                  onChange={handleChange}
                  className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  name="primaryColor"
                  value={form.primaryColor}
                  onChange={handleChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#1a1a2e]">Brand Assets</h2>
            <Input
              label="Logo URL"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
            {form.logo && (
              <div className="rounded-lg border p-4 bg-gray-50 flex items-center gap-3">
                <img
                  src={form.logo}
                  alt="Logo preview"
                  className="h-12 object-contain"
                />
                <span className="text-sm text-gray-500">Logo Preview</span>
              </div>
            )}
            <Input
              label="Favicon URL"
              name="favicon"
              value={form.favicon}
              onChange={handleChange}
              placeholder="https://example.com/favicon.ico"
            />
            {form.favicon && (
              <div className="rounded-lg border p-4 bg-gray-50 flex items-center gap-3">
                <img
                  src={form.favicon}
                  alt="Favicon preview"
                  className="h-8 w-8 object-contain"
                />
                <span className="text-sm text-gray-500">Favicon Preview</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
