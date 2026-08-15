import { useState, useEffect, type FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginApi } from "@/lib/auth";

const DEMO_EMAIL = "admin@sizzl.com";
const DEMO_PASSWORD = "AdminPassword123!";

interface Props {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("sizzl_remembered_email");
    const rememberedCheck = localStorage.getItem("sizzl_remember_me") === "1";
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(rememberedCheck);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await loginApi(email.trim(), password, remember);
      if (remember) {
        localStorage.setItem("sizzl_remembered_email", email.trim());
        localStorage.setItem("sizzl_remember_me", "1");
      } else {
        localStorage.removeItem("sizzl_remembered_email");
        localStorage.removeItem("sizzl_remember_me");
      }
      onLogin();
    } catch (err: any) {
      setError(err?.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "flex flex-row items-center gap-0 w-full h-[46px] border border-[#dcdfe4] rounded-lg bg-white px-3 transition-[border-color,box-shadow] duration-150 cursor-text relative focus-within:border-[#17181a] focus-within:shadow-[0_0_0_3px_rgba(23,24,26,.07)]";
  const fieldInputClass =
    "flex-1 min-w-0 border-0 outline-0 p-0 bg-transparent shadow-none text-[#27292c] text-[13px] h-full placeholder:text-[#b0b3b8]";

  return (
    <div className="min-h-screen w-full bg-[#e8e9eb] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.10)] px-9 pt-10 pb-8 flex flex-col items-center animate-[fadeIn_.25s_ease]">
        {/* Logo */}
        <div className="text-[28px] font-extrabold tracking-[-1.5px] text-[#17181a] mb-[22px] leading-none">
          sizzl<span className="text-[#17181a]">.</span>
        </div>

        {/* Heading */}
        <h1 className="m-0 mb-[6px] text-[20px] font-bold text-[#17181a] tracking-[-.4px] text-center">
          Welcome Back
        </h1>
        <p className="m-0 mb-[22px] text-[12px] text-[#8a8d92] text-center leading-normal">
          Please Enter Your Details Below to Continue
        </p>

        {/* Error */}
        {error && (
          <p className="w-full m-0 mb-3 px-3 py-[9px] rounded-md bg-[#ffe5e8] text-[#e5484d] text-[12px] text-center border border-[#ffb3b8] animate-[fadeIn_.2s_ease]">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          className="w-full flex flex-col gap-[14px]"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Email */}
          <label className={fieldClass}>
            <span className="flex items-center text-[#b0b3b8] shrink-0 mr-[10px] [&_svg]:w-4 [&_svg]:h-4">
              <Mail />
            </span>
            <div className="w-px h-[18px] bg-[#dcdfe4] shrink-0 mr-[10px]" />
            <input
              id="login-email"
              type="email"
              className={fieldInputClass}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </label>

          {/* Password */}
          <label className={fieldClass}>
            <span className="flex items-center text-[#b0b3b8] shrink-0 mr-[10px] [&_svg]:w-4 [&_svg]:h-4">
              <Lock />
            </span>
            <div className="w-px h-[18px] bg-[#dcdfe4] shrink-0 mr-[10px]" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className={fieldInputClass}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="grid place-items-center border-0 bg-transparent text-[#b0b3b8] p-0 shrink-0 ml-[6px] transition-colors duration-130 hover:text-[#17181a] [&_svg]:w-4 [&_svg]:h-4"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </label>

          {/* Remember me row */}
          <div className="flex items-center justify-start">
            <label className="inline-flex flex-row items-center gap-2 text-[12px] text-[#52565b] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-[15px] h-[15px] border-[1.5px] border-[#c5c8cc] rounded-[3px] bg-white p-0 m-0 shadow-none cursor-pointer shrink-0 accent-[#17181a]"
              />
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full h-[46px] border-0 rounded-[23px] bg-[#17181a] text-white text-[14px] font-semibold tracking-[.2px] cursor-pointer transition-[background,transform,opacity] duration-150 mt-1 hover:bg-[#2c2f34] active:scale-[.98] disabled:cursor-not-allowed${loading ? " opacity-70 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        {/* Quick Fill Credentials button */}
        <div className="mt-4 flex flex-col items-center gap-1.5 w-full">
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
            }}
            className="px-3 py-1 bg-[#f0f1f3] hover:bg-[#e4e6ea] text-[#374151] rounded-[12px] text-[11px] font-semibold transition-colors cursor-pointer border border-[#d1d4d9]"
          >
            ⚡ Auto-Fill Super Admin Credentials
          </button>
          <p className="m-0 text-[10px] text-[#8a8d92] text-center">
            email: <strong className="text-[#374151]">{DEMO_EMAIL}</strong> · password: <strong className="text-[#374151]">{DEMO_PASSWORD}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
