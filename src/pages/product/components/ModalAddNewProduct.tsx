import { App, Form, Spin } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import SkyModal, { SkyModalProps } from '~/components/sky-ui/SkyModal'
import SkyModalRow from '~/components/sky-ui/SkyModalRow'
import SkyModalRowItem from '~/components/sky-ui/SkyModalRowItem'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import define from '~/constants'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, Print } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import { ProductAddNewProps } from '../type'

interface Props extends SkyModalProps {
  onAddNew: (recordToAddNew: ProductAddNewProps, setLoading?: (enable: boolean) => void) => void
}

const ModalAddNewProduct: React.FC<Props> = ({ onAddNew, ...props }) => {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await colorService.getItemsSync({ paginator: { pageSize: -1, page: 1 } }, setLoading, (meta) => {
      if (meta?.success) {
        setColors(meta.data as Color[])
      }
    })
    await groupService.getItemsSync({ paginator: { pageSize: -1, page: 1 } }, setLoading, (meta) => {
      if (meta?.success) {
        setGroups(meta.data as Group[])
      }
    })
    await printService.getItemsSync({ paginator: { pageSize: -1, page: 1 } }, setLoading, (meta) => {
      if (meta?.success) {
        setPrints(meta.data as Print[])
      }
    })
  }

  async function handleOk() {
    await form
      .validateFields()
      .then((values) => {
        onAddNew({
          ...values,
          dateInputNPL: dateFormatter(values.dateInputNPL, 'iso8601'),
          dateOutputFCR: dateFormatter(values.dateOutputFCR, 'iso8601')
        })
      })
      .catch(() => {
        message.error(define('error_valid_form'))
      })
  }

  return (
    <SkyModal {...props} title='Thêm mã sản phẩm' okText='Create' onOk={handleOk}>
      <Spin spinning={loading} tip='loading'>
        <Form form={form} labelCol={{ xs: 24, md: 6 }} labelAlign='left' labelWrap>
          <SkyModalRow>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Mã Code'
                placeholder='Ví dụ: GAC021254'
                dataIndex='productCode'
                inputType='text'
                required
              />
            </SkyModalRowItem>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Số lượng PO'
                dataIndex='quantityPO'
                placeholder='Ví dụ: 1000'
                inputType='number'
                required
              />
            </SkyModalRowItem>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Mã màu:'
                dataIndex='colorID'
                inputType='colorSelector'
                placeholder='Ví dụ: Black'
                selectProps={{
                  options: colors.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: `${item.hexColor}-${item.id}`
                    }
                  })
                }}
              />
            </SkyModalRowItem>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Nhóm:'
                dataIndex='groupID'
                inputType='select'
                placeholder='Ví dụ: G1-4'
                selectProps={{
                  options: groups.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })
                }}
              />
            </SkyModalRowItem>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Nơi in:'
                dataIndex='printIDs'
                inputType='multipleSelect'
                placeholder='Ví dụ: T THINH, TIẾN THẮNG..'
                selectProps={{
                  options: prints.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })
                }}
              />
            </SkyModalRowItem>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Ngày nhập NPL:'
                dataIndex='dateInputNPL'
                inputType='datepicker'
                placeholder={`Ví dụ: ${dateFormatter(Date.now())}`}
              />
            </SkyModalRowItem>
            <SkyModalRowItem>
              <EditableFormCell
                isEditing={true}
                title='Ngày xuất FCR:'
                dataIndex='dateOutputFCR'
                inputType='datepicker'
                placeholder={`Ví dụ: ${dateFormatter(Date.now())}`}
              />
            </SkyModalRowItem>
          </SkyModalRow>
        </Form>
      </Spin>
    </SkyModal>
  )
}

export default memo(ModalAddNewProduct)
