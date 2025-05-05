
import IconComponent from "@/components/Icon-component/IconComponent";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      children: true
    },
    where: {
      OR: [
        { parentId: null },
        { parentId: { equals: prisma.category.fields.id } }
      ]
    }
  });

  // 按类型分类
  const articleCategories = categories.filter(c => c.type === 'ARTICLE');
  const forumCategories = categories.filter(c => c.type === 'FORUM');

  return { articleCategories, forumCategories };
}

export default async function AppSidebar() {
  const { articleCategories, forumCategories } = await getCategories();

  const renderCategoryGroup = (categories: typeof articleCategories, title: string) => (
    <SidebarGroup>
      <SidebarGroupLabel>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {categories.map(category => category.children.length ? (
          <Collapsible defaultOpen className="group/collapsible" key={category.id}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>

                <SidebarMenuButton className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {category.icon && <IconComponent name={category.icon} />}
                    <span>{category.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {category.children.map(sub => (
                    <SidebarMenuSubItem key={sub.id}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/category/${sub.id}`}>
                          {sub.icon && <IconComponent name={sub.icon} />}
                          {sub.name}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}

                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={category.id}>
            <SidebarMenuButton asChild>
              <Link href={`/category/${category.id}`}>{category.name}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <Sidebar>
      <SidebarHeader>
        导航
      </SidebarHeader>
      <SidebarContent>
        {renderCategoryGroup(articleCategories, "文章")}
        {renderCategoryGroup(forumCategories, "社区")}
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content */}
      </SidebarFooter>
    </Sidebar>
  );
}