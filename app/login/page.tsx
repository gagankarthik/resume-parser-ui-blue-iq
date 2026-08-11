"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthHeading, AuthShell } from "@/components/landing/AuthShell";
import { Button, ErrorBanner, Input, Label } from "@/components/ui";
import { confirmSignUp, login, resendCode } from "@/lib/account";

function isUnconfirmed(err: unknown): boolean {
  const e = err as { name?: string; code?: string; message?: string };
  return (
    e?.name === "UserNotConfirmedException" ||
    e?.code === "UserNotConfirmedException" ||
    /not confirmed/i.test(e?.message ?? "")
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function finishLogin() {
    await login(email, password);
    router.push("/dashboard");
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await finishLogin();
    } catch (err) {
      if (isUnconfirmed(err)) {
        try {
          await resendCode(email);
        } catch {
          /* ignore resend errors */
        }
        setNeedsConfirm(true);
        setInfo(`Your email isn't verified yet - we sent a code to ${email}.`);
      } else {
        setError(err instanceof Error ? err.message : "Sign in failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await confirmSignUp(email, code.trim());
      await finishLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
        {!needsConfirm ? (
          <>
            <AuthHeading
              title="Welcome back"
              sub="Sign in to manage your API keys, webhooks and usage."
            />
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <ErrorBanner message={error} />}
              <Button type="submit" loading={loading} className="w-full">
                Sign in
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-ink-soft">
              No account?{" "}
              <Link href="/signup" className="font-medium text-accent-700 hover:underline">
                Create one
              </Link>
            </p>
          </>
        ) : (
          <>
            <AuthHeading
              title="Verify your email"
              sub={info || "Enter the code we sent you to finish signing in."}
            />
            <form onSubmit={onConfirm} className="space-y-4">
              <div>
                <Label>Verification code</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} autoFocus required />
              </div>
              {error && <ErrorBanner message={error} />}
              <Button type="submit" loading={loading} className="w-full">
                Verify &amp; sign in
              </Button>
            </form>
          </>
        )}
    </AuthShell>
  );
}
