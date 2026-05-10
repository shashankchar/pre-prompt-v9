import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import ChatRoom from "./pages/ChatRoom";
import ClientDashboard from "./pages/ClientDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import EditorProfile from "./pages/EditorProfile";
import ExploreEditors from "./pages/ExploreEditors";
import LandingPage from "./pages/LandingPage";
import RequestProject from "./pages/RequestProject";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="explore" element={<ExploreEditors />} />
        <Route path="editors/:username" element={<EditorProfile />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route path="request/:editorId" element={<ProtectedRoute roles={["client", "admin"]}><RequestProject /></ProtectedRoute>} />
        <Route path="client-dashboard" element={<ProtectedRoute roles={["client", "admin"]}><ClientDashboard /></ProtectedRoute>} />
        <Route path="editor-dashboard" element={<ProtectedRoute roles={["editor", "admin"]}><EditorDashboard /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="projects/:projectId/chat" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
