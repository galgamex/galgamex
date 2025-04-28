import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";

// 服务端组件动态导入
const HeaderLinks = dynamic(() => import("@/components/header/HeaderLinks"), { ssr: true });
const MobileMenu = dynamic(() => import("@/components/header/MobileMenu"), { ssr: true });

const Header = () => {
  const t = useTranslations("Home");

  return (
    <header className="sticky top-0 z-50 border-b bg-background py-2 w-full">
      <div className="mx-auto px-2 sm:px-4 lg:px-12">
        <nav className="relative z-50 flex justify-between gap-x-6">
          <div className="flex items-center md:gap-x-12">
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
            <div className="hidden md:flex md:gap-x-6">
              <HeaderLinks />
            </div>
          </div>
          <div className="flex-1 flex align-center">
          </div>

          <div className="flex items-center gap-x-2 md:gap-x-4 lg:gap-x-6 justify-end">
            {/* PC */}
            <div className="hidden md:flex items-center gap-x-4">
              <LocaleSwitcher />
              <ThemeToggle />
              <div className="flex items-center gap-x-2">
                <I18nLink href="/login" prefetch={false}>
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </I18nLink>
                <I18nLink href="/register" prefetch={false}>
                  <Button variant="default" size="sm">
                    注册
                  </Button>
                </I18nLink>
              </div>
            </div>

            {/* Mobile */}
            <MobileMenu />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
