import { ShieldCheck, Wrench } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  DEMO_CREDENTIALS,
  ROLE_OPTIONS,
} from "../features/auth/authRepository";
import {
  validateLoginForm,
  validateUserForm,
} from "../features/auth/authValidation";

const loginInitialState = {
  email: "",
  password: "",
};

const signupInitialState = {
  name: "",
  email: "",
  role: "Admin",
  password: "",
  confirmPassword: "",
};

export default function Login() {
  const { login, signup, user, users } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInitialState);
  const [signupForm, setSignupForm] = useState(signupInitialState);
  const [errors, setErrors] = useState({});

  const registeredUsers = users.length;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginChange = (key) => (event) => {
    setLoginForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  };

  const handleSignupChange = (key) => (event) => {
    setSignupForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  };

  const submitLogin = (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(loginForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = login(loginForm);

    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }

    pushToast({
      title: "Welcome back",
      description: `Signed in as ${result.user.email}.`,
      tone: "success",
    });
    navigate("/dashboard", { replace: true });
  };

  const submitSignup = (event) => {
    event.preventDefault();

    const validationErrors = validateUserForm(signupForm, users, {
      mode: "create",
      requirePassword: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = signup(signupForm);

    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }

    pushToast({
      title: "Account created",
      description: `Welcome ${result.user.name}. Your local account is ready.`,
      tone: "success",
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[1.08fr_0.92fr]">
        <div className="hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              GSM Repair Suite
            </p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-white">
              Run your repair shop from one clean dashboard.
            </h1>
            <p className="mt-6 max-w-lg text-base text-white/80">
              Track repair orders, archive completed devices, manage users, and
              follow technician performance from one admin workspace.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <Wrench size={18} />
                </div>
                <div>
                  <p className="font-medium">Repair operations</p>
                  <p className="text-sm text-white/75">
                    Smart IDs, timelines, archive workflow, technician tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-medium">Local auth system</p>
                  <p className="text-sm text-white/75">
                    {registeredUsers} registered accounts stored locally in the browser
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Demo credentials
              </p>
              <div className="mt-4 space-y-3">
                {DEMO_CREDENTIALS.map((credential) => (
                  <div
                    key={credential.email}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-white">
                      {credential.email}
                    </p>
                    <p className="mt-1 text-sm text-white/80">
                      Password: {credential.password}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                      {credential.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl bg-slate-100 p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrors({});
                  }}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    mode === "login"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrors({});
                  }}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    mode === "signup"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                {mode === "login" ? "Welcome back" : "Create account"}
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                {mode === "login"
                  ? "Sign in to your repair dashboard"
                  : "Open a new local account"}
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                {mode === "login"
                  ? "Use one of the registered accounts or the demo credentials on the left."
                  : "Sign up creates a local account in this browser and signs you in immediately."}
              </p>
            </div>

            {mode === "login" ? (
              <form onSubmit={submitLogin} className="mt-8 space-y-4">
                <Input
                  label="Email"
                  placeholder="john@test.com"
                  value={loginForm.email}
                  onChange={handleLoginChange("email")}
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange("password")}
                  error={errors.password}
                />

                {errors.form ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errors.form}
                  </div>
                ) : null}

                <Button type="submit" variant="primary" className="w-full py-3">
                  Login
                </Button>
              </form>
            ) : (
              <form onSubmit={submitSignup} className="mt-8 space-y-4">
                <Input
                  label="Name"
                  placeholder="Manager name"
                  value={signupForm.name}
                  onChange={handleSignupChange("name")}
                  error={errors.name}
                />

                <Input
                  label="Email"
                  placeholder="manager@gsm.com"
                  value={signupForm.email}
                  onChange={handleSignupChange("email")}
                  error={errors.email}
                />

                <Select
                  label="Role"
                  options={ROLE_OPTIONS}
                  value={signupForm.role}
                  onChange={handleSignupChange("role")}
                  error={errors.role}
                />

                <Input
                  label="Password"
                  placeholder="At least 6 characters"
                  type="password"
                  value={signupForm.password}
                  onChange={handleSignupChange("password")}
                  error={errors.password}
                />

                <Input
                  label="Confirm password"
                  placeholder="Repeat the password"
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange("confirmPassword")}
                  error={errors.confirmPassword}
                />

                {errors.form ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errors.form}
                  </div>
                ) : null}

                <Button type="submit" variant="primary" className="w-full py-3">
                  Create account
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
