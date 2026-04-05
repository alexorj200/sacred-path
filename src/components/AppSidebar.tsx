import { Home, BookOpen, Compass, HandHeart, Users, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logoCross from "@/assets/logo-cross.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Biblioteca Espiritual", url: "/dashboard/biblioteca", icon: BookOpen },
  { title: "Jornadas Espirituales", url: "/dashboard/jornadas", icon: Compass },
  { title: "Oraciones Guiadas", url: "/dashboard/oraciones", icon: HandHeart },
  { title: "Comunidad", url: "/dashboard/comunidad", icon: Users },
  { title: "Perfil", url: "/dashboard/perfil", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="pt-6">
        <div className={`flex items-center gap-3 px-4 mb-8 ${collapsed ? "justify-center" : ""}`}>
          <img src={logoCross} alt="Logo" className="w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <span className="font-display text-sm text-sidebar-foreground tracking-wide">
              Camino Sagrado
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
