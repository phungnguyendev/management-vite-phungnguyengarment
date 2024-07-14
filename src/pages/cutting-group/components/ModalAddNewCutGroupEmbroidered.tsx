import { Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import DayJS, { dateFormatter } from '~/utils/date-formatter'
import { CutGroupEmbroideringNewRecordProps } from '../type'

interface Props extends SkyModalProps {
  onAddNew: (recordToAddNew: CutGroupEmbroideringNewRecordProps) => void
}

const ModalAddNewCutGroupEmbroidered: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      quantityArrived: row.quantityArrived,
      dateArrived: row.dateArrived ? dateFormatter(row.dateArrived, 'iso8601') : undefined
    })
  }

  return (
    <SkyModal
      {...props}
      title={props.title ?? 'Thêm in thêu về'}
      okText={props.okText ?? 'Create'}
      onOk={props.onOk ?? handleOk}
    >
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='SL in thêu về'
              dataIndex='quantityArrived'
              placeholder='Ví dụ: 500'
              inputType='number'
              required
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Ngày về:'
              dataIndex='dateArrived'
              inputType='datepicker'
              required
              placeholder={`Ví dụ: ${dateFormatter(Date.now())}`}
              defaultValue={DayJS(Date.now())}
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewCutGroupEmbroidered)
