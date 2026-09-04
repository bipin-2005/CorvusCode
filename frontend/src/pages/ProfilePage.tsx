import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User as UserIcon,
  Loader2,
  Code2,
  Briefcase,
  Globe,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import { Button, Card, Input, Label, PasswordInput } from "@/components/ui";

import {
  updateProfileSchema,
  type UpdateProfileFormData,
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/validation/profile.schema";

import {
  profileService,
  type ProfileData,
} from "@/services/profile.service";

import { saveUser, getUser } from "@/services/token";
import { getErrorMessage } from "@/utils/error";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await profileService.getMyProfile();

      setProfile(response.data);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111113]">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We couldn't load your profile. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113]">
        <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
          Account
        </p>

        <div className="flex items-center gap-3">
          <UserIcon className="h-7 w-7 text-orange-500" />

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Profile
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Manage your public profile information and account
          security.
        </p>
      </section>

      <ProfileSummaryCard profile={profile} />

      <ProfileInfoCard profile={profile} onUpdated={setProfile} />

      <ChangePasswordCard />
    </div>
  );
}

/* =====================================================
    SUMMARY CARD
====================================================== */

function ProfileSummaryCard({ profile }: { profile: ProfileData }) {
  const avatarLetter = profile.fullName?.charAt(0).toUpperCase() || "U";
  const isAdmin = profile.roles?.includes("ROLE_ADMIN");

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover dark:border-white/10"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/10 font-mono text-xl font-bold text-orange-600 dark:text-orange-400">
            {avatarLetter}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {profile.fullName}
            </h2>

            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                <ShieldCheck size={12} />
                Admin
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {profile.email}
          </p>

          {profile.bio && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {profile.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Rating:
              <span className="ml-1.5 font-medium text-slate-700 dark:text-slate-300">
                {profile.rating}
              </span>
            </span>

            <span>
              Solved:
              <span className="ml-1.5 font-medium text-slate-700 dark:text-slate-300">
                {profile.totalSolved}
              </span>
            </span>

            {profile.country && (
              <span>
                Country:
                <span className="ml-1.5 text-slate-700 dark:text-slate-300">
                  {profile.country}
                </span>
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
              >
                <Code2 size={14} />
                GitHub
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
              >
                <Briefcase size={14} />
                LinkedIn
              </a>
            )}

            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
              >
                <Globe size={14} />
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* =====================================================
    EDIT PROFILE CARD
====================================================== */

function ProfileInfoCard({
  profile,
  onUpdated,
}: {
  profile: ProfileData;
  onUpdated: (profile: ProfileData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      bio: profile.bio ?? "",
      country: profile.country ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      githubUrl: profile.githubUrl ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      websiteUrl: profile.websiteUrl ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const response = await profileService.updateMyProfile(data);

      onUpdated(response.data);

      const currentUser = getUser();

      saveUser(
        response.data.fullName,
        response.data.email,
        currentUser?.roles ?? []
      );

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
          Profile Information
        </h2>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
          This information may be visible to other users.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full Name</Label>

            <Input
              id="fullName"
              placeholder="Your full name"
              {...register("fullName")}
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>

            <Input
              id="country"
              placeholder="e.g. India"
              {...register("country")}
            />

            {errors.country && (
              <p className="mt-1 text-sm text-red-500">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>

          <textarea
            id="bio"
            rows={3}
            placeholder="Tell others a bit about yourself"
            className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 hover:border-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/15 dark:border-white/15 dark:bg-[#0a0a0b] dark:text-white dark:placeholder:text-slate-600 dark:hover:border-white/25"
            {...register("bio")}
          />

          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="avatarUrl">Avatar URL</Label>

          <Input
            id="avatarUrl"
            placeholder="https://example.com/avatar.png"
            {...register("avatarUrl")}
          />

          {errors.avatarUrl && (
            <p className="mt-1 text-sm text-red-500">
              {errors.avatarUrl.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="githubUrl">GitHub</Label>

            <Input
              id="githubUrl"
              placeholder="https://github.com/username"
              {...register("githubUrl")}
            />

            {errors.githubUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.githubUrl.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="linkedinUrl">LinkedIn</Label>

            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/username"
              {...register("linkedinUrl")}
            />

            {errors.linkedinUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.linkedinUrl.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="websiteUrl">Website</Label>

            <Input
              id="websiteUrl"
              placeholder="https://yourwebsite.com"
              {...register("websiteUrl")}
            />

            {errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.websiteUrl.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex w-auto items-center justify-center gap-2 px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* =====================================================
    CHANGE PASSWORD CARD
====================================================== */

function ChangePasswordCard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <KeyRound className="h-4 w-4 text-orange-500" />

        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Change Password
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Choose a strong password you don't use elsewhere.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md space-y-5"
      >
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>

          <PasswordInput
            id="currentPassword"
            placeholder="Enter current password"
            {...register("currentPassword")}
          />

          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword">New Password</Label>

          <PasswordInput
            id="newPassword"
            placeholder="Enter new password"
            {...register("newPassword")}
          />

          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>

          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter new password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          className="flex w-auto items-center justify-center gap-2 px-6"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Card>
  );
}
