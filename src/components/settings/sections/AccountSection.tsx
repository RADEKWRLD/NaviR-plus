"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { trpc } from "@/lib/trpc/client";
import SettingsInput from "../controls/SettingsInput";
import SettingsButton from "../controls/SettingsButton";

export default function AccountSection() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const updateNameMutation = trpc.account.updateName.useMutation();
  const updateEmailMutation = trpc.account.updateEmail.useMutation();
  const updatePasswordMutation = trpc.account.updatePassword.useMutation();
  const deleteAccountMutation = trpc.account.deleteAccount.useMutation();

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateName = async () => {
    if (!name.trim()) {
      showMessage("error", "Name cannot be empty");
      return;
    }
    try {
      await updateNameMutation.mutateAsync({ name });
      showMessage("success", "Name updated successfully!");
    } catch (error) {
      showMessage("error", `Failed to update name: ${error}`);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      showMessage("error", "Email cannot be empty");
      return;
    }
    if (!currentPassword) {
      showMessage("error", "Please enter your current password");
      return;
    }
    try {
      await updateEmailMutation.mutateAsync({ email, currentPassword });
      showMessage("success", "Email updated successfully!");
      setCurrentPassword("");
    } catch (error) {
      showMessage("error", `Failed to update email. Check your password.: ${error}`);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      showMessage("error", "Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      showMessage("error", "New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("error", "Passwords do not match");
      return;
    }
    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      showMessage("success", "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showMessage(
        "error",
        `Failed to update password. Check your current password.: ${error}`
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showMessage("error", "Please enter your password to confirm");
      return;
    }
    try {
      await deleteAccountMutation.mutateAsync({ password: deletePassword });
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (error) {
      showMessage("error", `Failed to delete account. Check your password.: ${error}`);
    }
  };

  return (
    <div className="space-y-8">
      <h3
        className="text-3xl font-bold uppercase tracking-wide mb-6 text-(--text-primary)"
        style={{ fontFamily: "var(--font-oxanium)" }}
      >
        Account
      </h3>

      <div className="flex flex-col gap-4">
        {/* Message display */}
        {message && (
          <div
            className={`p-4 border-[3px] ${
              message.type === "success"
                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20"
                : "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Update Name */}
        <div
          className="space-y-4 p-6 border-b-[3px] border-(--border-default)"
          style={{ paddingBottom: "1rem" }}
        >
          <h4
            className="font-bold uppercase text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Change Username
          </h4>
          <div className="flex flex-col gap-0.5">
            <SettingsInput label="Username" value={name} onChange={setName} />
            <SettingsButton
              onClick={handleUpdateName}
              loading={updateNameMutation.isPending}
            >
              Update Name
            </SettingsButton>
          </div>
        </div>

        {/* Update Email */}
        <div
          className="space-y-4 p-6 border-b-[3px] border-(--border-default)"
          style={{ paddingBottom: "1rem" }}
        >
          <h4
            className="font-bold uppercase text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Change Email
          </h4>
          <div className="flex flex-col gap-0.5">
            <SettingsInput
              label="New Email"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <SettingsInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <SettingsButton
              onClick={handleUpdateEmail}
              loading={updateEmailMutation.isPending}
            >
              Update Email
            </SettingsButton>
          </div>
        </div>

        {/* Update Password */}
        <div
          className="space-y-4 p-6 border-b-[3px] border-(--border-default)"
          style={{ paddingBottom: "1rem" }}
        >
          <h4
            className="font-bold uppercase text-(--text-primary)"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Change Password
          </h4>
          <div className="flex flex-col gap-0.5">
            <SettingsInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <SettingsInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <SettingsInput
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <SettingsButton
              onClick={handleUpdatePassword}
              loading={updatePasswordMutation.isPending}
            >
              Update Password
            </SettingsButton>
          </div>
        </div>

        {/* Delete Account - Danger Zone */}
        <div
          className="space-y-4 p-6 border-b-[3px] border-red-500 bg-red-50 dark:bg-red-900/20"

        >
          <h4
            className="font-bold uppercase text-red-600"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Danger Zone
          </h4>
          <p className="text-sm text-red-600">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          {!showDeleteConfirm ? (
            <SettingsButton
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </SettingsButton>
          ) : (
            <div className="space-y-4">
              <SettingsInput
                label="Enter your password to confirm"
                type="password"
                value={deletePassword}
                onChange={setDeletePassword}
              />
              <div className="flex gap-4">
                <SettingsButton
                  variant="danger"
                  onClick={handleDeleteAccount}
                  loading={deleteAccountMutation.isPending}
                >
                  Confirm Delete
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                  }}
                >
                  Cancel
                </SettingsButton>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Policy Link */}
        <div className="p-6 text-center">
          <a
            href="/privacy"
            className="text-sm text-(--text-secondary) hover:text-(--color-accent) underline transition-colors"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
