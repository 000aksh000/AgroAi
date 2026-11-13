import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const INDIAN_STATES = [
  "Maharashtra",
  "Punjab",
  "Gujarat",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Karnataka",
  "Haryana",
  "Rajasthan",
  "Andhra Pradesh",
  "Tamil Nadu",
  "West Bengal",
  "Bihar"
];

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    state: user?.state || "Maharashtra",
    district: user?.district || "",
    preferredLanguage: user?.preferredLanguage || "en"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.put("/auth/profile", profileForm);
      return res.data.data;
    },
    onSuccess: (data) => {
      updateUser(data);
      setProfileSuccess(true);
      setProfileError(null);
      setTimeout(() => setProfileSuccess(false), 3000);
    },
    onError: (err) => {
      setProfileError(err.response?.data?.error?.message || "Failed to update profile.");
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New passwords do not match.");
      }
      const res = await apiClient.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      return res.data;
    },
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError(null);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (err) => {
      setPasswordError(err.message || err.response?.data?.error?.message || "Failed to change password.");
    }
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E8DD]">
        <h1 className="text-2xl font-black text-charcoal tracking-tight">Farmer Profile & Settings</h1>
        <p className="text-xs text-muted mt-1 font-medium">
          Manage your personal contact info, regional location, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Farmer ID Card */}
        <Card className="text-center p-6 md:col-span-1">
          <div className="w-20 h-20 rounded-full bg-forest-700 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4 uppercase shadow-subtle border-2 border-forest-600/30">
            {user?.name ? user.name.charAt(0) : "F"}
          </div>
          <h2 className="text-base font-bold text-charcoal">{user?.name}</h2>
          <p className="text-xs text-muted truncate">{user?.email}</p>
          <div className="mt-3 flex justify-center">
            <Badge variant="leaf" size="sm" className="capitalize">
              {user?.role || "Farmer"} Account
            </Badge>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E8DD] text-left text-xs space-y-2.5 text-charcoal">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-soil-500" />
              <span>{user?.district ? `${user.district}, ` : ""}{user?.state || "India"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-soil-500" />
              <span className="text-muted">{user?.phone || "No phone added"}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="w-full mt-6 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </Card>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">
              Personal Information
            </h3>

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-charcoal mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">State</label>
                  <select
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">District</label>
                  <input
                    type="text"
                    value={profileForm.district}
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                />
              </div>

              <Button type="submit" isLoading={updateProfileMutation.isPending} size="sm">
                Save Profile Details
              </Button>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-forest-700" />
              Security & Password
            </h3>

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0" />
                <span>Password updated successfully! Other sessions have been revoked.</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                changePasswordMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-charcoal mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E8DD] focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white text-charcoal"
                  />
                </div>
              </div>

              <Button type="submit" isLoading={changePasswordMutation.isPending} size="sm">
                Change Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
