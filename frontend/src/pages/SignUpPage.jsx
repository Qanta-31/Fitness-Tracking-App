import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {Eye,EyeOff,Loader2,Lock,Mail,MessageSquare,User,Ruler,Weight,Calendar,Venus} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    gender: "",
    dob: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!formData.height) {
      toast.error("Height is required");
      return false;
    }
    if (!formData.weight) {
      toast.error("Weight is required");
      return false;
    }
    if (!formData.gender) {
      toast.error("Gender is required");
      return false;
    }
    if (!formData.dob) {
      toast.error("Date of Birth is required");
      return false;
    }
  
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              {/* <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div> */}
              <h1 className="text-2xl font-bold mt-6">Create Account</h1>
              {/* <p className="text-base-content/60">Get started with your free account</p> */}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="form-control">
              {/* <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label> */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              {/* <label className="label">
                <span className="label-text font-medium">Email</span>
              </label> */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              {/* <label className="label">
                <span className="label-text font-medium">Password</span>
              </label> */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Height and Weight Side by Side */}
            <div className="flex gap-4">
              {/* Height */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text font-medium">Height (cm)</span>
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                  <input
                    type="number"
                    className="input input-bordered w-full pl-10"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text font-medium">Weight (kg)</span>
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                  <input
                    type="number"
                    className="input input-bordered w-full pl-10"
                    placeholder="60"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Gender and DOB Side by Side */}
            <div className="flex gap-4">
              {/* Gender */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text font-medium">Gender</span>
                </label>
                <div className="relative">
                  <Venus className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                  <select
                    className="input input-bordered w-full pl-10"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* DOB */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text font-medium">Date of Birth</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                  <input
                    type="date"
                    className="input input-bordered w-full pl-10"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side visual */}
      <AuthImagePattern
        title="Start Your Fitness Journey"
        subtitle="Join us today to track your progress and unlock your full potential."
      />
    </div>
  );
};

export default SignUpPage;
