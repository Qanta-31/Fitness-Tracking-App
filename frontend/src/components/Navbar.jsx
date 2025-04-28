import { Link, useNavigate } from "react-router-dom"; // <-- ADD useNavigate
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  User,
  BarChart3,
  Activity,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate(); // <-- Initialize navigate


  const handleLogout = async () => {
    await logout(); // <-- Wait for logout API call to finish
    navigate("/login"); // <-- Redirect to login page
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left side - Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">FitSync</h1>
            </Link>
          </div>

          {/* Right side - Buttons based on auth status */}
          <div className="flex items-center gap-2">
            {authUser ? (
              <>
                <Link to="/analytics" className="btn btn-sm gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Performance</span>
                </Link>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm hover:opacity-80 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link to="/signup" className="btn btn-sm gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
