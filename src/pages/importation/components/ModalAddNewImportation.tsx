import { Form } from 'antd'
import React, { memo } from 'react'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import DayJS, { dateFormatter } from '~/utils/date-formatter'
import { ImportationExpandableAddNewProps } from '../type'

interface Props extends SkyModalProps {
  onAddNew: (recordToAddNew: ImportationExpandableAddNewProps, setLoading?: (enable: boolean) => void) => void
}

const ModalAddNewImportation: React.FC<Props> = ({ onAddNew, ...props }) => {
  const [form] = Form.useForm()

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew({
      quantity: row.quantity,
      dateImported: row.dateImported
    })
  }

  return (
    <SkyModal
      {...props}
      title={props.title ?? 'Thêm lô hàng nhập khẩu'}
      okText={props.okText ?? 'Thêm'}
      onOk={props.onOk ?? handleOk}
    >
      <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
        <SkyModalRow>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Lô nhập'
              dataIndex='quantity'
              placeholder='Ví dụ: 500'
              inputType='number'
              required
              inputNumberProps={{
                suffix: (
                  <SkyTableTypography className='mr-5' type='secondary'>
                    Kiện
                  </SkyTableTypography>
                )
              }}
            />
          </SkyModalRowItem>
          <SkyModalRowItem>
            <EditableFormCell
              isEditing={true}
              title='Ngày nhập:'
              dataIndex='dateImported'
              inputType='datepicker'
              required
              placeholder={`Ví dụ: ${dateFormatter(Date.now())}`}
              initialValue={DayJS(Date.now())}
            />
          </SkyModalRowItem>
        </SkyModalRow>
      </Form>
    </SkyModal>
  )
}

export default memo(ModalAddNewImportation)
