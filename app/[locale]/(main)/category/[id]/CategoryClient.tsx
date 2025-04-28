"use client"

import PortraitCard from "@/components/portrait-card/PortraitCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Article } from "@/types/article"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

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
    types: string[];
    platforms: string[];
    ratings: string[];
  };
  categoryId: string;
}

export default function CategoryClient({ articles, pagination, filterOptions, categoryId }: CategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState({
    year: "全部",
    type: "全部",
    platform: "全部",
    rating: "全部"
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);

  // 滚动容器的引用
  const typeScrollRef = useRef<HTMLDivElement>(null)
  const yearScrollRef = useRef<HTMLDivElement>(null)
  const platformScrollRef = useRef<HTMLDivElement>(null)
  const ratingScrollRef = useRef<HTMLDivElement>(null)

  // 判断是否有筛选器激活
  const hasActiveFilters = selectedFilters.year !== "全部" ||
    selectedFilters.type !== "全部" ||
    selectedFilters.platform !== "全部" ||
    selectedFilters.rating !== "全部" ||
    searchTerm !== "";

  // 过滤文章的函数
  const filterArticles = (articles: Article[]) => {
    return articles.filter(article => {
      // 搜索词过滤
      if (searchTerm && !article.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // 年份筛选
      if (selectedFilters.year !== "全部") {
        const articleYear = article.createdAt.getFullYear().toString()
        if (articleYear !== selectedFilters.year) {
          return false
        }
      }

      // 类型筛选 (使用tag中的name进行筛选)
      if (selectedFilters.type !== "全部" && article.tag) {
        // 检查文章的标签是否包含所选类型
        const hasType = article.tag.some(t => t.name === selectedFilters.type)
        if (!hasType) {
          return false
        }
      }

      // 平台筛选 (假设可以从download中的type判断平台)
      if (selectedFilters.platform !== "全部" && article.download) {
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
    })
  }

  // 在客户端过滤文章
  const filteredArticles = filterArticles(articles)

  // 更新URL并导航到新页面
  const navigateToPage = useCallback((page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/${params.get('locale') || 'zh'}/(main)/category/${categoryId}?${params.toString()}`);
  }, [router, searchParams, categoryId]);

  // 重置所有筛选器
  const resetFilters = () => {
    setSelectedFilters({
      year: "全部",
      type: "全部",
      platform: "全部",
      rating: "全部"
    });
    setSearchTerm("");
    // 如果有筛选激活时点击重置，刷新页面回到第一页
    if (hasActiveFilters) {
      router.push(`/${searchParams.get('locale') || 'zh'}/(main)/category/${categoryId}`);
    }
  };

  // 当搜索词或筛选器更改时，重置到第一页
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      router.push(`/${params.get('locale') || 'zh'}/(main)/category/${categoryId}?${params.toString()}`);
    }
  }, [selectedFilters, searchTerm, router, searchParams, categoryId, currentPage]);

  // 生成分页按钮数组
  const generatePaginationButtons = () => {
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
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-3">
          {/* 分类筛选行 - 使用水平滚动 */}
          <div className="flex items-start gap-2">
            <span className="text-sm text-gray-500 w-16 pt-1 shrink-0">分类：</span>
            <div className="relative flex-1 overflow-hidden">
              <div
                ref={typeScrollRef}
                className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              >
                {filterOptions.types.map((type) => (
                  <Button
                    key={type}
                    variant={selectedFilters.type === type ? "default" : "outline"}
                    size="sm"
                    className="text-xs px-3 shrink-0"
                    onClick={() => setSelectedFilters({ ...selectedFilters, type })}
                  >
                    {type}
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
                {filterOptions.years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedFilters.year === year ? "default" : "outline"}
                    size="sm"
                    className="text-xs px-3 shrink-0"
                    onClick={() => setSelectedFilters({ ...selectedFilters, year })}
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
                {filterOptions.platforms.map((platform) => (
                  <Button
                    key={platform}
                    variant={selectedFilters.platform === platform ? "default" : "outline"}
                    size="sm"
                    className="text-xs px-3 shrink-0"
                    onClick={() => setSelectedFilters({ ...selectedFilters, platform })}
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
                {filterOptions.ratings.map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedFilters.rating === rating ? "default" : "outline"}
                    size="sm"
                    className="text-xs px-3 shrink-0"
                    onClick={() => setSelectedFilters({ ...selectedFilters, rating })}
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
      </div>

      {/* 排序和展示区域 */}
      <div className="mb-6">
        <Tabs defaultValue="default">
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
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredArticles.map((article) => (
                  <PortraitCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-500">没有找到符合条件的游戏</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  清除筛选条件
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="newest" className="mt-0">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[...filteredArticles].sort((a, b) => b.id - a.id).map((article) => (
                  <PortraitCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-500">没有找到符合条件的游戏</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  清除筛选条件
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[...filteredArticles].sort((a, b) => b.views - a.views).map((article) => (
                  <PortraitCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-500">没有找到符合条件的游戏</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  清除筛选条件
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="mt-0">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[...filteredArticles].sort((a, b) => b.comments - a.comments).map((article) => (
                  <PortraitCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-500">没有找到符合条件的游戏</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  清除筛选条件
                </Button>
              </div>
            )}
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

          {generatePaginationButtons()}

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
