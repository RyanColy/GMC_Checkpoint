import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ConversationPage from "./pages/ConversationPage";
import GroupPage from "./pages/GroupPage";
import UserProfile from "./pages/UserProfile";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <SocketProvider>
            <MainPage />
          </SocketProvider>
        </PrivateRoute>
      }
    >
      <Route path="conversation/:userId" element={<ConversationPage />} />
      <Route path="group/:groupId" element={<GroupPage />} />
      <Route path="profile" element={<UserProfile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
