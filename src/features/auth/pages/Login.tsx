import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../authApi";



const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(form).unwrap();
      console.log("Login successful:", response);
      localStorage.setItem("token", response.token);
      localStorage.setItem("id", response.id);
      localStorage.setItem("instituteName", response.instituteName);
      localStorage.setItem("name", response.name);
      localStorage.setItem("role", response.role);
      localStorage.setItem("email", response.email);

      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err?.data?.msg || "Login failed. Please check your credentials."
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              Admin Login
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Enter your email below to login to your account
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="m@example.com"
              value={form.email}
              onChange={handleChange}
              className="block w-full text-black rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
            />
          </div>

          {/* Password + forgot */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-900"
              >
                Password
              </label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-lg border text-black border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Login button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-black text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <Link
            className="flex justify-center items-center gap-2 w-full cursor-pointer text-sm text-neutral-600 hover:text-neutral-900"
            to="/"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
