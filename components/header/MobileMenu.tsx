import { headerLinks } from "@/components/header/HeaderLinks";
import IconComponent from "@/components/Icon-component/IconComponent";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

// 获取分类
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

export default async function MobileMenu() {
  const t = useTranslations("Home");
  const tHeader = useTranslations("Header");
  const { articleCategories, forumCategories } = await getCategories();

  return (
    <div className="flex items-center gap-x-2 md:hidden">
      <LocaleSwitcher />
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <Menu className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <I18nLink
              href="/"
              prefetch={false}
              className="flex items-center space-x-1 font-bold"
            >
              <Image
                alt={siteConfig.name}
                src="/logo.svg"
                className="w-6 h-6"
                width={32}
                height={32}
              />
              <span className="text-gray-800 dark:text-gray-200">
                {t("title")}
              </span>
            </I18nLink>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* 文章分类 */}
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>文章</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {articleCategories.map((category) => (
                    category.children.length > 0 ? (
                      <DropdownMenuSub key={category.id}>
                        <DropdownMenuSubTrigger>
                          <div className="flex items-center gap-2">
                            {category.icon && <IconComponent name={category.icon} />}
                            <span>{category.name}</span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {category.children.map((child) => (
                              <DropdownMenuItem key={child.id}>
                                <Link
                                  href={`/category/${child.id}`}
                                  className="flex items-center gap-2 w-full"
                                >
                                  {child.icon && <IconComponent name={child.icon} />}
                                  {child.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuItem key={category.id}>
                        <Link
                          href={`/category/${category.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          {category.icon && <IconComponent name={category.icon} />}
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          {/* 社区分类 */}
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>社区</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {forumCategories.map((category) => (
                    category.children.length > 0 ? (
                      <DropdownMenuSub key={category.id}>
                        <DropdownMenuSubTrigger>
                          <div className="flex items-center gap-2">
                            {category.icon && <IconComponent name={category.icon} />}
                            <span>{category.name}</span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {category.children.map((child) => (
                              <DropdownMenuItem key={child.id}>
                                <Link
                                  href={`/category/${child.id}`}
                                  className="flex items-center gap-2 w-full"
                                >
                                  {child.icon && <IconComponent name={child.icon} />}
                                  {child.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuItem key={category.id}>
                        <Link
                          href={`/category/${category.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          {category.icon && <IconComponent name={category.icon} />}
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          {/* 标准链接 */}
          <DropdownMenuGroup>
            {headerLinks.map((link) => (
              <DropdownMenuItem key={link.name}>
                <I18nLink
                  href={link.href}
                  title={tHeader(link.name)}
                  prefetch={false}
                  target={link.target}
                  rel={link.rel}
                  className="w-full"
                >
                  {tHeader(link.name)}
                </I18nLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          {/* 登录注册 */}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <I18nLink href="/login" prefetch={false} className="w-full">
                登录
              </I18nLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <I18nLink href="/register" prefetch={false} className="w-full">
                注册
              </I18nLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
