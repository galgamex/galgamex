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

const HeaderLinks = async () => {
  const categories = await prisma.category.findMany({
    include: {
      children: true
    },
    where: {
      parentId: null
    }

  });

  return (
    <div className="hidden md:flex flex-row items-center gap-x-4 font-bold">
      <NavigationMenu>
        <NavigationMenuList>
          {categories.map((category) => {
            return category.children.length > 0 ? (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex flex-col w-[200px] p-2">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <ListItem
                          href={`/category/${child.id}`}
                          title={child.name}
                          className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={category.id}>
                <ListItem
                  href={`/category/${category.id}`}
                  className="hover:text-gray-800 dark:hover:text-gray-200"
                >
                  {category.name}
                </ListItem >
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
export default HeaderLinks;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, ...props }, ref) => {
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
        <div className="text-sm font-medium leading-none">{title}</div>
      </a>
    </NavigationMenuLink>
  )
});
ListItem.displayName = "ListItem";