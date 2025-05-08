import { Sidebar, SidebarGroupContent, SidebarGroup, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader } from './ui/sidebar'
import { Home, BookOpen, Key, TestTube } from 'lucide-react'

const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
        title: "Your Rules",
        url: "/rules",
        icon: BookOpen,
    },
    {
        title: "API Keys",
        url: "/api-keys",
        icon: Key,
    },
    {
        title: "Test",
        url: "/test",
        icon: TestTube,
    },
 
]

export default function CustomSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
            MetaCitizen
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>  
  )
}
