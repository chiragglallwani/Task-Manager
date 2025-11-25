import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Dashboard } from "@/pages/Dashboard";
import { PrivateLayout } from "@/layouts/PrivateLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { TaskManage } from "@/pages/TaskManage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTheme } from "./hooks/useTheme";
import { Switch } from "./components/ui/switch";

function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="relative">
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="absolute top-4 right-4"
      />

      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicLayout>
                  <Signup />
                </PublicLayout>
              }
            />
            <Route
              path="/task-manager"
              element={
                <PrivateLayout>
                  <TaskManage />
                </PrivateLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </div>
  );
}

export default App;
