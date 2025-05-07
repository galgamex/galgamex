import { findUser, updateUser } from '@/model/user/user';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 为了演示，使用固定用户ID (1)
    // 实际应用中，应该从会话获取用户ID
    const userId = 1;

    switch (req.method) {
      case 'GET':
        // 获取用户资料
        const user = await findUser({ id: userId });

        if (!user) {
          return res.status(404).json({ error: '用户不存在' });
        }

        // 移除敏感信息
        // @ts-ignore
        const { password, ...safeUserData } = user;
        return res.status(200).json(safeUserData);

      case 'PUT':
        // 更新用户资料
        const userData = req.body;

        // 防止用户更新敏感字段
        delete userData.password;
        delete userData.email; // 邮箱修改应通过单独的API并验证
        delete userData.role;
        delete userData.id;

        // 更新用户资料
        const updatedUser = await updateUser({
          where: { id: userId },
          data: userData
        });

        // 移除敏感信息
        // @ts-ignore
        const { password: pwd, ...safeUpdatedData } = updatedUser;
        return res.status(200).json(safeUpdatedData);

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}