// 枚举类型定义

// 布局类型
export type Layout = 'SQUARE' | 'PORTRAIT' | 'LANDSCAPE';

// 下载类型
export type DownloadType = 
  | 'BAIDU'       // 百度网盘
  | 'ONEDRIVE'    // 微软网盘
  | 'MEGA'        // MEGA网盘
  | 'GOOGLEDRIVE' // 谷歌网盘
  | 'UC'          // UC网盘
  | 'QUARK'       // 夸克网盘
  | 'DIRECT'      // 直接下载链接
  | 'PIKPAK'      // PikPak网盘
  | 'OTHER';      // 其他下载方式

// 分级
export type Stage = 'SFW' | 'NSFW' | 'R15' | 'R18' | 'R18G';

// 点赞类型
export type LikeType = 'ARTICLE' | 'COMMENT';

// 用户角色
export type Role = 'ADMIN' | 'USER' | 'VIP' | 'CIRCLER';

// 状态
export type Status = 'DRAFT' | 'HIDDEN' | 'PUBLISH' | 'RECYCLE';

// 内容类型
export type Type = 'ARTICLE' | 'FORUM';

// 用户日志类型
export type UserLogType = 
  | 'LOGIN'     // 登录
  | 'LOGOUT'    // 登出
  | 'REGISTER'  // 注册
  | 'UPDATE'    // 更新资料
  | 'DELETE'    // 删除账号
  | 'RESET'     // 重置密码
  | 'BAN'       // 被封禁
  | 'UNBAN'     // 解除封禁
  | 'WARN';     // 警告

// 任务类型
export type TaskType = 
  | 'SIGNUP'          // 注册账号
  | 'LOGIN'           // 每日登录
  | 'COMMENT'         // 发表评论
  | 'UPLOAD'          // 上传资源
  | 'DOWNLOAD'        // 下载资源
  | 'SHARE'           // 分享内容
  | 'VIEW'            // 浏览内容
  | 'INVITE'          // 邀请用户
  | 'COMPLETE_PROFILE' // 完善资料
  | 'RATE'            // 评分
  | 'CUSTOM';         // 自定义任务

// 重复周期
export type RepeatCycle = 
  | 'DAILY'           // 每日任务
  | 'WEEKLY'          // 每周任务
  | 'MONTHLY'         // 每月任务
  | 'ONCE';           // 一次性任务

// 奖励类型
export type RewardType = 
  | 'POINTS'          // 积分奖励
  | 'VIP'             // VIP天数
  | 'BADGE'           // 徽章
  | 'DOWNLOAD';       // 下载额度

// 积分记录类型
export type PointLogType = 
  | 'TASK'            // 任务奖励
  | 'ADMIN'           // 管理员调整
  | 'EXPIRED'         // 积分过期
  | 'REFUND'          // 退款
  | 'PROMOTION'       // 促销活动
  | 'PURCHASE'        // 购买商品
  | 'EXCHANGE';       // 兑换商品

// 经验来源类型
export type LevelExpSource = 
  | 'LOGIN'           // 每日登录
  | 'ARTICLE'         // 发布文章
  | 'COMMENT'         // 发表评论
  | 'RECEIVED_LIKE'   // 收到点赞
  | 'UPLOAD'          // 上传资源
  | 'DOWNLOAD'        // 资源被下载
  | 'TASK'            // 完成任务
  | 'ADMIN';          // 管理员调整

// 审核类型
export type ReviewType = 
  | 'PATCH'     // 游戏补丁
  | 'SAVE'      // 游戏存档
  | 'DOWNLOAD'  // 下载链接
  | 'CHARACTER' // 游戏角色
  | 'COMMENT';  // 用户评论

// 审核状态
export type ReviewStatus = 
  | 'PENDING'   // 待审核
  | 'APPROVED'  // 已通过
  | 'REJECTED'  // 已拒绝
  | 'MODIFIED'; // 已修改后通过 