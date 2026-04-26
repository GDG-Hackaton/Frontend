import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/Landing";
import { BrowsePage } from "../features/wanted/components/browse/BrowsePage";
import { PostDetailPage } from "../features/wanted/components/post/PostDetailPage";
import { CreatePostPage } from "../features/wanted/components/create/CreatePostPage";
import { ProfilePage } from "../features/wanted/components/profile/ProfilePage";
import { ClaimsPage } from "../features/wanted/components/claims/ClaimsPage";
import { ChatPage } from "../features/wanted/components/chat/ChatPage";
import { SuccessStories } from "../features/wanted/components/shared/SuccessStories";
import { StoriesPage } from "../features/wanted/stories/StoriesPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/ResetPasswordPage";
import { CreateProfilePage } from "../features/wanted/components/profile/CreateProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CreateStory } from "../features/wanted/stories/CreateStory";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* for wanted */}

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route path="/wanted" element={<BrowsePage />} />
      <Route path="/wanted/stories" element={<StoriesPage />} />
      <Route path="/stories/success" element={<Navigate to="/wanted/stories" replace />} />

      {/* Private Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/wanted/post/:id" element={<PostDetailPage />} />
        <Route path="/wanted/create" element={<CreatePostPage />} />
        <Route path="/wanted/stories/share" element={<CreateStory />} />

        <Route path="/wanted/profile" element={<ProfilePage />} />
        <Route path="/wanted/claims" element={<ClaimsPage />} />
        <Route path="/wanted/chat/:roomId?" element={<ChatPage />} />
        <Route path="/wanted/profile/create" element={<CreateProfilePage />} />
      </Route>

      {/* general */}
      <Route path="/how-it-works" element={<div>How It Works</div>} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/mission" element={<div>Mission</div>} />
      <Route path="/contact" element={<div>Contact</div>} />
      <Route path="/privacy-policy" element={<div>Privacy Policy</div>} />
      <Route path="/terms-of-service" element={<div>Terms of Service</div>} />

      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
