"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const { t } = useTranslations();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(`/${lang}`);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">
              {t("auth.login")}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back. Please sign in to your account.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label={t("auth.email")}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              autoComplete="email"
            />

            <div>
              <Input
                id="password"
                type="password"
                label={t("auth.password")}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                autoComplete="current-password"
              />
              <div className="mt-1 text-right">
                <Link
                  href={`/${lang}/auth/forgot-password`}
                  className="text-xs text-[#c9a96e] hover:text-[#b8934e] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? t("common.loading") || "Signing in..."
                : t("auth.loginButton")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("auth.noAccount")}{" "}
            <Link
              href={`/${lang}/auth/register`}
              className="font-medium text-[#c9a96e] hover:text-[#b8934e] transition-colors"
            >
              {t("auth.registerNow")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
