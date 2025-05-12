import { Sidebar, SidebarGroupContent, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from './ui/sidebar'
import { Home, Key, TestTube, File, Shield } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      description: "Dashboard overview"
    },
    {
      title: "Templates",
      url: "/templates",
      icon: File,
      description: "Manage verification templates"
    },
    {
      title: "Verification",
      url: "/verification",
      icon: Shield,
      description: "Verify your identity"
    },
    {
        title: "API Keys",
        url: "/test",
        icon: Key,
        description: "Manage API access"
    },
    {
        title: "Test",
        url: "/test",
        icon: TestTube,
        description: "Testing environment"
    }
]

export default function CustomSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="min-w-[240px] border-r hidden md:block">
      <SidebarContent>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">MZ</span>
            <span className="text-xl font-bold">MetaCitizen</span>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="px-2 py-1">
                    <SidebarMenuButton asChild className="w-full">
                      <Link
                        to={item.url} 
                        className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted"
                        }`}
                        title={item.description}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        Version 0.1.0
      </SidebarFooter>
    </Sidebar>  
  )
}
