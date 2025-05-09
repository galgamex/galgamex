import { Chip, Card, CardBody, Button } from '@nextui-org/react'
import { KunAvatar } from '~/components/kun/floating-card/KunAvatar'
import { formatDate } from '~/utils/time'
import Link from 'next/link'
import { ReportHandler } from './ReportHandler'
import type { AdminReport } from '~/types/api/admin'

interface Props {
  report: AdminReport
}

export const ReportCard = ({ report }: Props) => {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <KunAvatar
              uid={report.sender!.id}
              avatarProps={{
                name: report.sender!.name,
                src: report.sender!.avatar
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{report.sender?.name}</h2>
                <span className="text-small text-default-500">
                  {formatDate(report.created, {
                    isPrecise: true,
                    isShowYear: true
                  })}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap">{report.content}</p>

              <div className="flex items-center gap-4 mt-2">
                <Chip
                  color={report.status ? 'success' : 'danger'}
                  variant="flat"
                >
                  {report.status ? '已处理' : '未处理'}
                </Chip>
                <Button
                  as={Link}
                  size="sm"
                  color="primary"
                  variant="flat"
                  href={`/${report.patchUniqueId}`}
                >
                  前往游戏
                </Button>
                <Button
                  as={Link}
                  size="sm"
                  color="primary"
                  variant="flat"
                  href={`/user/${report.sender?.id}/resource`}
                >
                  前往用户
                </Button>
              </div>
            </div>
          </div>

          <ReportHandler initialReport={report} />
        </div>
      </CardBody>
    </Card>
  )
}
