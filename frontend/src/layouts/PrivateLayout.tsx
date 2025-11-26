import { Navbar } from "@/components/Navigation/Navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  return (
    <div className="min-h-screen flex w-full">
      <Navbar />
      <main className="w-full flex-1">
        <SidebarTrigger />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};
