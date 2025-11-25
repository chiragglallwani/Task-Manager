import { useAuth } from "@/hooks/useAuth";
import {
  Layers3Icon,
  LayoutDashboardIcon,
  LayoutListIcon,
  LogOutIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const Navbar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { open } = useSidebar();
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Task Management",
      url: "/task-manager",
      icon: Layers3Icon,
    },
  ];
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {open ? (
        <SidebarHeader className="text-2xl font-bold flex flex-row items-center gap-2 my-4">
          <LayoutListIcon />
          <p>Task Manager</p>
        </SidebarHeader>
      ) : (
        <SidebarHeader className="text-2xl font-bold">
          <LayoutListIcon />
        </SidebarHeader>
      )}
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          className="hover:cursor-pointer"
          onClick={() => logout()}
          asChild
        >
          <div>
            <LogOutIcon />
            <span>Logout</span>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
