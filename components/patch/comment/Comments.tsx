'use client'

import { useEffect, useState } from 'react'
import { Card, CardBody } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { KunUser } from '~/components/kun/floating-card/KunUser'
import { MessageCircle, ArrowUpDown, SendHorizontal } from 'lucide-react'
import { kunFetchGet, kunFetchPost } from '~/utils/kunFetch'
import { formatDistanceToNow } from '~/utils/formatDistanceToNow'
import { CommentLikeButton } from './CommentLike'
import { CommentDropdown } from './CommentDropdown'
import { CommentContent } from './CommentContent'
import { scrollIntoComment } from './_scrollIntoComment'
import { useUserStore } from '~/store/userStore'
import { KunNull } from '~/components/kun/Null'
import { cn } from '~/utils/cn'
import { NeumorphicEditor } from './NeumorphicEditor'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import toast from 'react-hot-toast'
import type { PatchComment } from '~/types/api/patch'

interface Props {
  id: number
}

type SortOrder = 'asc' | 'desc'

export const Comments = ({ id }: Props) => {
  const [comments, setComments] = useState<PatchComment[]>([])
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showEditor, setShowEditor] = useState(false)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    if (!user.uid) {
      return
    }

    const fetchData = async () => {
      const res = await kunFetchGet<PatchComment[]>('/patch/comment', {
        patchId: Number(id)
      })
      setComments(res)
    }
    fetchData()
  }, [id, user.uid])

  const sortComments = (commentsToSort: PatchComment[]): PatchComment[] => {
    const sortedComments = [...commentsToSort].sort((a, b) => {
      const dateA = new Date(a.created).getTime()
      const dateB = new Date(b.created).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

    return sortedComments.map((comment) => ({
      ...comment,
      reply: comment.reply ? sortComments(comment.reply) : []
    }))
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const setNewComment = async (newComment: PatchComment) => {
    setComments((prevComments) => [...prevComments, newComment])
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    scrollIntoComment(newComment.id)
  }

  const handlePublishComment = async (content: string) => {
    const res = await kunFetchPost<KunResponse<PatchComment>>(
      '/patch/comment',
      {
        patchId: id,
        parentId: null,
        content
      }
    )

    kunErrorHandler(res, (value) => {
      setNewComment({
        ...value,
        user: { id: user.uid, name: user.name, avatar: user.avatar }
      })
      toast.success('评论发布成功')
      setShowEditor(false)
    })
  }

  const handlePublishReply = async (parentId: number, content: string) => {
    const res = await kunFetchPost<KunResponse<PatchComment>>(
      '/patch/comment',
      {
        patchId: id,
        parentId,
        content
      }
    )

    kunErrorHandler(res, (value) => {
      setNewComment({
        ...value,
        user: { id: user.uid, name: user.name, avatar: user.avatar }
      })
      toast.success('回复发布成功')
      setReplyTo(null)
    })
  }

  if (!user.uid) {
    return <KunNull message="请登陆后查看评论" />
  }

  const renderComments = (comments: PatchComment[], depth = 0) => {
    return comments.map((comment) => {
      // 查找被回复的用户名
      const replyToUsername = comment.quotedUsername || comment.user.name;

      return (
        <div
          key={comment.id}
          className={cn(depth <= 3 && depth !== 0 ? `ml-6` : 'ml-0', 'space-y-4')}
        >
          <Card id={`comment-${comment.id}`} className="border-none shadow-sm dark:bg-content1/70 backdrop-blur-sm">
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <KunUser
                    user={comment.user}
                    userProps={{
                      name: comment.user.name,
                      description: formatDistanceToNow(comment.created),
                      avatarProps: {
                        showFallback: true,
                        name: comment.user.name,
                        src: comment.user.avatar,
                        size: "sm"
                      }
                    }}
                  />
                  <CommentDropdown comment={comment} setComments={setComments} />
                </div>

                <CommentContent comment={comment} />

                <div className="flex gap-2 mt-1">
                  <CommentLikeButton comment={comment} />
                  <Button
                    variant="light"
                    size="sm"
                    className="gap-1 text-default-500"
                    onPress={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                  >
                    <MessageCircle className="size-4" />
                    回复
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {replyTo === comment.id && (
            <div className="mt-2 ml-6">
              <NeumorphicEditor
                patchId={id}
                parentId={comment.id}
                receiverUsername={replyToUsername}
                onCancel={() => setReplyTo(null)}
                onSubmit={(content) => handlePublishReply(comment.id, content)}
              />
            </div>
          )}

          {comment.reply && comment.reply.length > 0 && (
            <>{renderComments(comment.reply, depth + 1)}</>
          )}
        </div>
      );
    });
  }

  const sortedComments = sortComments(comments)

  return (
    <div className="space-y-4">
      {!showEditor ? (
        <Button
          color="primary"
          variant="flat"
          className="w-full h-16 gap-2"
          onPress={() => setShowEditor(true)}
        >
          <SendHorizontal className="size-5" />
          写评论...
        </Button>
      ) : (
        <NeumorphicEditor
          patchId={id}
          onCancel={() => setShowEditor(false)}
          onSubmit={handlePublishComment}
        />
      )}

      {!!sortedComments.length && (
        <div className="flex items-center gap-2 px-2">
          <Button variant="light" size="sm" className="gap-2" onPress={toggleSortOrder}>
            <ArrowUpDown className="size-4" />
            {sortOrder === 'asc' ? '最早优先' : '最新优先'}
          </Button>
          <span className="text-default-500 text-sm">{comments.length} 条评论</span>
        </div>
      )}

      {renderComments(sortedComments)}
    </div>
  )
}
