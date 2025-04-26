"use client";

import { Article } from '@/types/article';
import React from 'react';

export default function ArticleDetailClient(article?: Article) {
  // 模拟数据，实际应从API获取
  const gameData = {
    id: 1,
    title: "春风之恋 ~樱花盛开的季节~",
    originalTitle: "春風の恋 ~桜咲く季節~",
    releaseDate: "2023-04-15",
    developer: "ChieriSoft",
    publisher: "ChieriSoft",
    rating: 9.3,
    description: '《春风之恋》是一款以日本校园为背景的恋爱模拟游戏。玩家将扮演主角在樱花盛开的季节里，邂逅各种性格迥异的女主角，发展出各自不同的故事线。游戏融合了精美的立绘、感人的剧情和丰富的选择支，带给玩家沉浸式的视觉小说体验。故事发生在一个名为"樱花坂"的虚构小镇，主角因各种原因转学至此，开始了全新的校园生活...',
    tags: ["校园恋爱", "视觉小说", "青春", "日常", "治愈", "情感", "轻喜剧", "文艺"],
    characters: [
      {
        name: "樱井千夏",
        cv: "佐藤日和",
        desc: "班长，成绩优异，性格认真但有点傲娇。喜欢阅读和花道。"
      },
      {
        name: "星野美月",
        cv: "高桥礼奈",
        desc: "学妹，性格活泼开朗，总是充满活力。是学校啦啦队的成员。"
      },
      {
        name: "藤原惠",
        cv: "木村真纪",
        desc: "青梅竹马，温柔体贴，擅长料理。自小与主角一起长大。"
      },
      {
        name: "高桥结衣",
        cv: "田中花子",
        desc: "转学生，神秘冷漠，很少与人交流。拥有出色的音乐才能。"
      },
      {
        name: "中村小雪",
        cv: "山本美咲",
        desc: "学姐，文学社社长，沉稳成熟。喜欢写小说，有洞察力。"
      },
      {
        name: "佐藤亮介",
        cv: "鈴木大輔",
        desc: "主角的好友，性格开朗，是学校棒球部的王牌投手。"
      }
    ],
    screenshots: [1, 2, 3, 4, 5] // 用于模拟截图数据
  };

  // 标签颜色映射
  const tagColors = [
    "bg-pink-600 dark:bg-pink-800",
    "bg-blue-600 dark:bg-blue-800",
    "bg-purple-600 dark:bg-purple-800",
    "bg-green-600 dark:bg-green-800",
    "bg-yellow-600 dark:bg-yellow-800",
    "bg-red-600 dark:bg-red-800",
    "bg-indigo-600 dark:bg-indigo-800",
    "bg-teal-600 dark:bg-teal-800"
  ];

  // 角色背景颜色
  const characterBgColors = [
    "bg-pink-400 dark:bg-pink-600",
    "bg-purple-400 dark:bg-purple-600",
    "bg-blue-400 dark:bg-blue-600",
    "bg-green-400 dark:bg-green-600",
    "bg-yellow-400 dark:bg-yellow-600",
    "bg-red-400 dark:bg-red-600"
  ];

  // 模拟标签选项卡状态
  const [activeTab, setActiveTab] = React.useState('characters');

  return (
    <div className="w-full">
      <main className="container mx-auto px-4 py-8">
        {/* 选项卡菜单 */}
        <div className="mb-8">
          <div className="tabs flex flex-wrap border-b border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap pb-1">
            <button
              onClick={() => setActiveTab('characters')}
              className={`py-2 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'characters'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              角色介绍
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-2 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'guide'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              攻略指南
            </button>
            <button
              onClick={() => setActiveTab('patch')}
              className={`py-2 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'patch'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              汉化补丁
            </button>
            <button
              onClick={() => setActiveTab('saves')}
              className={`py-2 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'saves'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              存档下载
            </button>
            <button
              onClick={() => setActiveTab('cg')}
              className={`py-2 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'cg'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              CG画廊
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
                }`}
            >
              用户评价
            </button>
          </div>

          {/* 角色介绍内容 */}
          {activeTab === 'characters' && (
            <div className="py-6 opacity-0 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">游戏角色</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {gameData.characters.map((character, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className={`${characterBgColors[index % characterBgColors.length]} aspect-[4/6] w-full`}></div>
                    <div className="p-3">
                      <h3 className="text-base font-semibold mb-1 truncate text-slate-900 dark:text-white">{character.name}</h3>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">CV: {character.cv}</div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{character.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 其他标签页内容 */}
          {activeTab === 'guide' && (
            <div className="py-6 opacity-0 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">攻略指南</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <p className="text-gray-700 dark:text-gray-300 mb-4">此处显示游戏攻略内容...</p>
              </div>
            </div>
          )}

          {/* 可以添加其他标签页内容 */}
        </div>
      </main>
    </div>
  );
}