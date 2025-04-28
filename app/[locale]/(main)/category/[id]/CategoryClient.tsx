"use client"

import PortraitCard from "@/components/portrait-card/PortraitCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Article } from "@/types/article"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// 分页接口定义
interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// 组件接口定义
interface CategoryClientProps {
  articles: Article[];
  pagination: PaginationInfo;
  filterOptions: {
    years: string[];
    tags: string[];
    platforms: string[];
    ratings: string[];
  };
  categoryId: string;
}

export default function CategoryClient({ articles, pagination, filterOptions, categoryId }: CategoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 确保文章数据有效，如果无效则使用空数组
  const validArticles = Array.isArray(articles) ? articles : [];

  const [selectedFilters, setSelectedFilters] = useState({
    year: "全部",
    tag: "全部",
    platform: "全部",
    rating: "全部"
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [sortType, setSortType] = useState("default");

  // 滚动容器的引用
  const tagScrollRef = useRef<HTMLDivElement>(null)
  const yearScrollRef = useRef<HTMLDivElement>(null)
  const platformScrollRef = useRef<HTMLDivElement>(null)
  const ratingScrollRef = useRef<HTMLDivElement>(null)

  // 判断是否有筛选器激活 - 使用useMemo优化
  const hasActiveFilters = useMemo(() => {
    return selectedFilters.year !== "全部" ||
      selectedFilters.tag !== "全部" ||
      selectedFilters.platform !== "全部" ||
      selectedFilters.rating !== "全部" ||
      searchTerm !== "";
  }, [selectedFilters, searchTerm]);

  // 过滤文章的函数 - 使用useMemo缓存结果避免重复计算
  const filteredArticles = useMemo(() => {
    return validArticles.filter(article => {
      // 搜索词过滤
      if (searchTerm && !article.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // 年份筛选
      if (selectedFilters.year !== "全部") {
        const articleYear = article.createdAt?.getFullYear().toString()
        if (articleYear !== selectedFilters.year) {
          return false
        }
      }

      // 标签筛选 (使用文章的tags关联进行筛选)
      if (selectedFilters.tag !== "全部" && article.tags && article.tags.length > 0) {
        // 检查文章的标签是否与所选类型匹配
        const hasMatchingTag = article.tags.some(tagRelation => {
          // 使用类型断言来解决类型问题
          const tagInfo = (tagRelation as any).tag;
          return tagInfo?.name === selectedFilters.tag;
        });

        if (!hasMatchingTag) {
          return false;
        }
      }

      // 平台筛选 (假设可以从download中的type判断平台)
      if (selectedFilters.platform !== "全部" && article.download && article.download.length > 0) {
        // 特定平台映射 (可根据实际需求调整)
        const platformMapping: Record<string, string[]> = {
          "PC": ["DIRECT", "BAIDU", "ONEDRIVE", "MEGA", "GOOGLEDRIVE"],
          "安卓": ["DIRECT", "BAIDU"],
          "KRKR": ["DIRECT"]
        }

        // 检查文章的下载链接是否包含所选平台
        const supportsPlatform = article.download.some(d =>
          platformMapping[selectedFilters.platform]?.includes(d.type as string)
        )

        if (!supportsPlatform) {
          return false
        }
      }

      // 年龄分级筛选
      if (selectedFilters.rating !== "全部") {
        if (selectedFilters.rating === "R18" && article.stage !== "R18") {
          return false
        } else if (selectedFilters.rating === "全年龄" && (article.stage === "R18" || article.stage === "R15")) {
          return false
        }
      }

      return true
    });
  }, [validArticles, searchTerm, selectedFilters]);

  // 对筛选后的文章进行排序 - 使用useMemo缓存排序结果
  const sortedArticles = useMemo(() => {
    const sorted = [...filteredArticles];

    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      case "popular":
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "comments":
        return sorted.sort((a, b) => (b.comments || 0) - (a.comments || 0));
      default:
        return sorted; // 默认排序
    }
  }, [filteredArticles, sortType]);

  // 创建URL查询参数的函数
  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([name, value]) => {
        if (value) {
          newSearchParams.set(name, value);
        } else {
          newSearchParams.delete(name);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // 更新URL并导航到新页面 - 使用useCallback避免重复创建函数
  const navigateToPage = useCallback((page: number) => {
    setCurrentPage(page);
    const query = createQueryString({ page: page.toString() });
    router.push(`${pathname}?${query}`);
  }, [router, pathname, createQueryString]);

  // 重置所有筛选器 - 使用useCallback
  const resetFilters = useCallback(() => {
    setSelectedFilters({
      year: "全部",
      tag: "全部",
      platform: "全部",
      rating: "全部"
    });
    setSearchTerm("");
    setCurrentPage(1);
    setSortType("default");

    // 重置URL，删除所有筛选参数
    router.push(pathname);
  }, [router, pathname]);

  // 更新筛选器 - 使用useCallback
  const updateFilter = useCallback((key: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));

    // 重置到第一页
    setCurrentPage(1);
  }, []);

  // 处理搜索输入 - 防抖处理
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // 处理排序方式改变
  const handleSortChange = useCallback((value: string) => {
    setSortType(value);
  }, []);

  // 当搜索词或筛选器更改时，重置到第一页
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedFilters, searchTerm]);

  // 生成分页按钮数组 - 使用useMemo缓存结果
  const paginationButtons = useMemo(() => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisibleButtons - 1);

    // 调整startPage以确保显示最大数量的页码
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // 总是显示第一页
    if (startPage > 1) {
      buttons.push(
        <Button
          key="1"
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(1)}
        >
          1
        </Button>
      );

      // 如果起始页不是第2页，添加省略号
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-2">...</span>
        );
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => navigateToPage(i)}
        >
          {i}
        </Button>
      );
    }

    // 如果不是最后几页，添加省略号和最后一页
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-2">...</span>
        );
      }

      buttons.push(
        <Button
          key={pagination.totalPages}
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(pagination.totalPages)}
        >
          {pagination.totalPages}
        </Button>
      );
    }

    return buttons;
  }, [currentPage, navigateToPage, pagination.totalPages]);

  // 使用memo优化筛选按钮渲染
  const renderFilterButtons = useMemo(() => {
    return (
      <div className="space-y-3">
        {/* 标签筛选行 - 使用水平滚动 */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-gray-500 w-16 pt-1 shrink-0">标签：</span>
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={tagScrollRef}
              className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {(filterOptions.tags || ["全部"]).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedFilters.tag === tag ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 shrink-0"
                  onClick={() => updateFilter('tag', tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 年份筛选行 - 使用水平滚动 */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-gray-500 w-16 pt-1 shrink-0">年份：</span>
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={yearScrollRef}
              className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {(filterOptions.years || ["全部"]).map((year) => (
                <Button
                  key={year}
                  variant={selectedFilters.year === year ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 shrink-0"
                  onClick={() => updateFilter('year', year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 平台筛选行 - 使用水平滚动 */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-gray-500 w-16 pt-1 shrink-0">平台：</span>
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={platformScrollRef}
              className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {(filterOptions.platforms || ["全部"]).map((platform) => (
                <Button
                  key={platform}
                  variant={selectedFilters.platform === platform ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 shrink-0"
                  onClick={() => updateFilter('platform', platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 年龄筛选行 - 使用水平滚动 */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-gray-500 w-16 pt-1 shrink-0">年龄：</span>
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={ratingScrollRef}
              className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {(filterOptions.ratings || ["全部"]).map((rating) => (
                <Button
                  key={rating}
                  variant={selectedFilters.rating === rating ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3 shrink-0"
                  onClick={() => updateFilter('rating', rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 筛选器状态和重置按钮 */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm text-gray-500">
              已筛选：{filteredArticles.length} 个结果
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              重置筛选
            </Button>
          </div>
        )}
      </div>
    );
  }, [filterOptions, selectedFilters, updateFilter, hasActiveFilters, filteredArticles.length, resetFilters]);

  // 优化：仅在实际有内容时渲染文章列表
  const renderArticleList = useCallback((articles: Article[]) => {
    if (articles.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">没有找到符合条件的游戏</p>
          <Button variant="outline" className="mt-4" onClick={resetFilters}>
            清除筛选条件
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {articles.map((article) => (
          <PortraitCard key={article.id} article={article} />
        ))}
      </div>
    );
  }, [resetFilters]);

  // 防抖搜索输入 - 使用useRef和useEffect
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 清除之前的定时器
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // 300ms防抖
    searchTimeout.current = setTimeout(() => {
      handleSearchChange(value);
    }, 300);
  }, [handleSearchChange]);

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <>
      {/* 顶部筛选区域 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 mb-6 rounded-lg">
        {/* 搜索框 */}
        <div className="mb-4 relative">
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索游戏名称..."
              defaultValue={searchTerm}
              onChange={handleSearchInputChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {renderFilterButtons}
      </div>

      {/* 排序和展示区域 */}
      <div className="mb-6">
        <Tabs defaultValue={sortType} onValueChange={handleSortChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="default">默认排序</TabsTrigger>
              <TabsTrigger value="newest">最新发布</TabsTrigger>
              <TabsTrigger value="popular">人气最高</TabsTrigger>
              <TabsTrigger value="comments">评论最多</TabsTrigger>
            </TabsList>
          </div>

          {/* 内容区域 */}
          <TabsContent value="default" className="mt-0">
            {renderArticleList(sortedArticles)}
          </TabsContent>

          <TabsContent value="newest" className="mt-0">
            {renderArticleList(sortedArticles)}
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            {renderArticleList(sortedArticles)}
          </TabsContent>

          <TabsContent value="comments" className="mt-0">
            {renderArticleList(sortedArticles)}
          </TabsContent>
        </Tabs>
      </div>

      {/* 分页 */}
      {filteredArticles.length > 0 && (
        <div className="flex justify-center space-x-2 mt-8 mb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => navigateToPage(currentPage - 1)}
          >
            上一页
          </Button>

          {paginationButtons}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === pagination.totalPages}
            onClick={() => navigateToPage(currentPage + 1)}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 分页信息 */}
      {filteredArticles.length > 0 && (
        <div className="text-center text-sm text-gray-500 mb-8">
          第 {pagination.currentPage} 页，共 {pagination.totalPages} 页，总计 {pagination.totalItems} 个游戏
        </div>
      )}
    </>
  );
}
