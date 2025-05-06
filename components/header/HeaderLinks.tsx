import IconComponent from "@/components/Icon-component/IconComponent";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { SOURCE_CODE_URL } from "@/config/site";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import React from "react";

// 获取分类
export const headerLinks = [
  {
    name: "blogs",
    href: "/blogs",
  },
  {
    name: "user",
    href: "/user",
  },
  {
    name: "about",
    href: "/about",
  },
  {
    name: "sourceCode",
    href: SOURCE_CODE_URL,
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  },
];

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
  const articleCategories = categories.filter((c: any) => c.type === 'ARTICLE');
  const forumCategories = categories.filter((c: any) => c.type === 'FORUM');

  return { articleCategories, forumCategories };
}

const HeaderLinks = async () => {
  const { articleCategories, forumCategories } = await getCategories();
  const allCategories = [...articleCategories, ...forumCategories];

  return (
    <div className="hidden md:flex flex-row items-center gap-x-4 font-bold">
      <NavigationMenu>
        <NavigationMenuList>
          {/* 文章分类 */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>文章</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 gap-3 p-4 md:w-[400px] lg:w-[500px]">
                {articleCategories.map((category: any) => (
                  <li key={category.id}>
                    {category.children.length > 0 ? (
                      <div className="mb-2">
                        <h3 className="font-medium leading-none mb-2 text-sm">{category.name}</h3>
                        <ul className="space-y-1">
                          {category.children.map((child: any) => (
                            <li key={child.id}>
                              <ListItem
                                href={`/category/${child.id}`}
                                title={child.name}
                                icon={child.icon || undefined}
                                className="text-sm"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <ListItem
                        href={`/category/${category.id}`}
                        title={category.name}
                        icon={category.icon || undefined}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* 社区分类 */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>社区</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-2 gap-3 p-4 md:w-[400px] lg:w-[500px]">
                {forumCategories.map((category: any) => (
                  <li key={category.id}>
                    {category.children.length > 0 ? (
                      <div className="mb-2">
                        <h3 className="font-medium leading-none mb-2 text-sm">{category.name}</h3>
                        <ul className="space-y-1">
                          {category.children.map((child: any) => (
                            <li key={child.id}>
                              <ListItem
                                href={`/category/${child.id}`}
                                title={child.name}
                                icon={child.icon || undefined}
                                className="text-sm"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <ListItem
                        href={`/category/${category.id}`}
                        title={category.name}
                        icon={category.icon || undefined}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* 标准链接 */}
          {headerLinks.map((link) => (
            <NavigationMenuItem key={link.name}>
              <ListItem
                href={link.href}
                className="hover:text-gray-800 dark:hover:text-gray-200"
                target={link.target}
                rel={link.rel}
              >
                {link.name}
              </ListItem>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
export default HeaderLinks;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: string }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 text-sm font-medium leading-none">
          {icon && <IconComponent name={icon} className="h-4 w-4" />}
          {title || children}
        </div>
      </a>
    </NavigationMenuLink>
  )
});
ListItem.displayName = "ListItem";
