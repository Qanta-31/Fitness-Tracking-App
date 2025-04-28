import { useAuthStore } from "../store/useAuthStore";
import { Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Personal details */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.name}</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            {/* Height & Weight */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="text-sm text-zinc-400">Height (cm)</div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.height}</p>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="text-sm text-zinc-400">Weight (kg)</div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.weight}</p>
              </div>
            </div>

            {/* Gender & DOB */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="text-sm text-zinc-400">Gender</div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.gender}</p>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="text-sm text-zinc-400">Date of Birth</div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {new Date(authUser?.dob).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
