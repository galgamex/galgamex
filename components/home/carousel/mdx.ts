export interface HomeCarouselMetadata {
  title: string
  banner: string
  description: string
  date: string
  authorName: string
  authorAvatar: string
  pin: boolean
  directory: string
  link: string
}

// 从API获取轮播图数据
export const getKunPosts = async (): Promise<HomeCarouselMetadata[]> => {
  try {
    const response = await fetch('/api/carousel', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 确保每次获取最新数据
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch carousel data:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching carousel data:', error);
    return [];
  }
}
