import { List, ListProps } from 'antd'
import { ResponseDataType } from '~/api/client'
import { ActionProps } from '../ActionRow'

export interface SkyListProps<T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>
  extends ListProps<T> {
  metaData: ResponseDataType | undefined
  onPageChange?: (page: number, pageSize: number) => void
  isShowDeleted?: boolean
  editingKey: React.Key
  deletingKey: React.Key
  actions?: ActionProps<T>
  scrollTo?: number
}

const SkyList = <T extends { key?: React.Key; createdAt?: string; updatedAt?: string }>({
  ...props
}: SkyListProps<T>) => {
  return (
    <List
      className={props.className}
      itemLayout='vertical'
      size='large'
      loading={props.loading}
      pagination={
        props.pagination ?? {
          onChange: props.onPageChange,
          current: props.metaData?.page,
          pageSize: props.metaData?.pageSize
            ? props.metaData.pageSize !== -1
              ? props.metaData.pageSize
              : undefined
            : 10,
          total: props.metaData?.total
        }
      }
      renderItem={props.renderItem}
      dataSource={props.dataSource}
    />
  )
}

export default SkyList
