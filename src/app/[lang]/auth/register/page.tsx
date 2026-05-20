"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function RegisterPage() {
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const { t } = useTranslations();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      // Auto-login after successful registration
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed, redirect to login
        router.push(`/${lang}/auth/login`);
      } else {
        router.push(`/${lang}`);
        router.refresh();
      }
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
              {t("auth.register")}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Create an account to start shopping.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              type="text"
              label={t("auth.name")}
              placeholder="Your full name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              autoComplete="name"
            />

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

            <Input
              id="password"
              type="password"
              label={t("auth.password")}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              autoComplete="new-password"
              minLength={8}
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
              autoComplete="new-password"
            />

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
                ? t("common.loading") || "Creating account..."
                : t("auth.registerButton")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("auth.hasAccount")}{" "}
            <Link
              href={`/${lang}/auth/login`}
              className="font-medium text-[#c9a96e] hover:text-[#b8934e] transition-colors"
            >
              {t("auth.loginNow")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
