"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  AuthUser,
  getCurrentUser,
  login,
  logout,
  register,
} from "@/lib/api";

type AuthMode = "login" | "register";

const initialRegister = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const initialLogin = {
  email: "",
  password: "",
  remember: false,
};

export default function Home() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const clearFeedback = useCallback(() => {
    setMessage("");
    setError("");
  }, []);

  const statusText = useMemo(() => {
    if (isLoading) {
      return "Working...";
    }

    if (currentUser) {
      return `Authenticated as ${currentUser.email}`;
    }

    return "Not authenticated";
  }, [currentUser, isLoading]);

  async function refreshUser() {
    clearFeedback();
    setIsLoading(true);

    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setMessage("Session is active and backend connection works.");
    } catch {
      setCurrentUser(null);
      setError("No active session found yet.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();
    setIsLoading(true);

    try {
      const response = await register(registerForm);
      setCurrentUser(response.user);
      setMessage(response.message);
      setRegisterForm(initialRegister);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();
    setIsLoading(true);

    try {
      const response = await login(loginForm);
      setCurrentUser(response.user);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    clearFeedback();
    setIsLoading(true);

    try {
      const response = await logout();
      setCurrentUser(null);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log out.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 lg:py-16">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Laravel + Next.js Starter
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Template connectivity and auth smoke test
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Use this page to confirm your frontend can talk to your Laravel API,
          create a user, sign in, read the current session user, and sign out.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Auth panel</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {statusText}
            </span>
          </div>

          <div className="mb-4 flex rounded-full border border-slate-200 p-1">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`w-1/2 rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "register"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`w-1/2 rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </button>
          </div>

          {mode === "register" ? (
            <form className="space-y-3" onSubmit={handleRegister}>
              <input
                required
                value={registerForm.name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                placeholder="Name"
              />
              <input
                required
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                placeholder="Email"
              />
              <input
                required
                type="password"
                minLength={8}
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                placeholder="Password"
              />
              <input
                required
                type="password"
                minLength={8}
                value={registerForm.password_confirmation}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    password_confirmation: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                placeholder="Confirm password"
              />
              <button
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
              >
                Create account
              </button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={handleLogin}>
              <input
                required
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                placeholder="Email"
              />
              <input
                required
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                placeholder="Password"
              />
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={loginForm.remember}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      remember: event.target.checked,
                    }))
                  }
                />
                Remember me
              </label>
              <button
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
              >
                Login
              </button>
            </form>
          )}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={refreshUser}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Check session
            </button>
            <button
              type="button"
              disabled={isLoading || !currentUser}
              onClick={handleLogout}
              className="rounded-xl border border-rose-300 px-4 py-2.5 text-sm font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Logout
            </button>
          </div>

          {message ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </article>

        <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Current user</h2>

          {currentUser ? (
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100 sm:text-sm">
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              No user loaded yet. Register or login, then click Check session.
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Checklist</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Laravel is running on http://localhost:8000</li>
              <li>Next.js is running on http://localhost:3000</li>
              <li>Both .env files are configured from .env.example</li>
              <li>Backend migrations have been executed</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
}
