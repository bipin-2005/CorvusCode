import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/ProfilePage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import ProblemsPage from "../pages/ProblemsPage";
import ProblemPage from "../pages/ProblemPage";

import SubmissionsPage from "../pages/SubmissionsPage";
import SubmissionDetailsPage from "../pages/SubmissionDetailsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import ContestsPage from "../pages/ContestsPage";
import ContestDetailsPage from "../pages/ContestDetailsPage";
import ContestWorkspacePage from "../pages/ContestWorkspacePage";

import MainLayout from "../components/layout/MainLayout";

// Admin
import AdminLayout from "@/admin/layouts/AdminLayout";
import DashboardPage from "@/admin/pages/DashboardPage";
import UsersPage from "@/admin/pages/UsersPage";
import AdminUserProfilePage from "@/admin/pages/UserProfilePage";
import AdminProblemsPage from "@/admin/pages/ProblemsPage";
import AdminContestsPage from "@/admin/pages/ContestsPage";
import SettingsPage from "@/admin/pages/SettingsPage";
import AdminProblemFormPage from "@/admin/pages/AdminProblemFormPage";
import ProblemExamplesPage from "@/admin/pages/ProblemExamplesPage";
import ProblemTestCasesPage from "@/admin/pages/ProblemTestCasesPage";
import ProblemStarterCodesPage from "@/admin/pages/ProblemStarterCodesPage";
import AdminContestFormPage from "@/admin/pages/AdminContestFormPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected User Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:slug" element={<ProblemPage />} />

          <Route path="/contests" element={<ContestsPage />} />
          <Route
            path="/contests/:id"
            element={<ContestDetailsPage />}
          />

          <Route
            path="/submissions"
            element={<SubmissionsPage />}
          />

          <Route
            path="/submissions/:id"
            element={<SubmissionDetailsPage />}
          />
        </Route>

<Route
  path="/contests/:id/workspace"
  element={
    <ProtectedRoute>
      <ContestWorkspacePage />
    </ProtectedRoute>
  }
/>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="users" element={<UsersPage />} />

          <Route
            path="users/:id/profile"
            element={<AdminUserProfilePage />}
          />

          <Route
            path="problems"
            element={<AdminProblemsPage />}
          />

          <Route
            path="problems/create"
            element={<AdminProblemFormPage />}
          />

          <Route
            path="problems/:id/edit"
            element={<AdminProblemFormPage />}
          />

          <Route
            path="problems/:id/examples"
            element={<ProblemExamplesPage />}
          />

          <Route
            path="problems/:id/testcases"
            element={<ProblemTestCasesPage />}
          />

          <Route
            path="problems/:id/starter-codes"
            element={<ProblemStarterCodesPage />}
          />

          <Route
            path="contests"
            element={<AdminContestsPage />}
          />

          <Route
            path="contests/create"
            element={<AdminContestFormPage />}
          />

          <Route
            path="contests/:id/edit"
            element={<AdminContestFormPage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}