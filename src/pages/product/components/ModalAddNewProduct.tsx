import { Flex, Form, Modal, Spin } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import AddNewTitle from '~/components/sky-ui/AddNewTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, Print } from '~/typing'
import DayJS from '~/utils/date-formatter'

export interface ProductAddNewProps {
  productCode?: string | null
  quantityPO?: number | null
  colorID?: number | null
  groupID?: number | null
  printID?: number | null
  dateInputNPL?: string
  dateOutputFCR?: string | null
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  loading: boolean
  setOpenModal: (enable: boolean) => void
  setLoading: (enable: boolean) => void
  onAddNew: (recordToAddNew: ProductAddNewProps) => void
}

const ModalAddNewProduct: React.FC<Props> = ({ loading, openModal, setOpenModal, setLoading, onAddNew, ...props }) => {
  const [form] = Form.useForm()
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)
  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])
  console.log('Load AddNewProduct...')

  useEffect(() => {
    const loadData = async () => {
      await colorService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setColors(meta.data as Color[])
          }
        }
      )
      await groupService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setGroups(meta.data as Group[])
          }
        }
      )
      await printService.getListItems(
        { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
        setLoading,
        (meta) => {
          if (meta?.success) {
            setPrints(meta.data as Print[])
          }
        }
      )
    }
    loadData()
  }, [])

  async function handleOk() {
    const row = await form.validateFields()
    onAddNew(row)
  }

  function handleCancel() {
    setOpenModal(false)
  }

  return (
    <Modal
      title={<AddNewTitle title='Add new' />}
      open={openModal}
      onOk={handleOk}
      centered
      width='auto'
      onCancel={handleCancel}
    >
      <Spin spinning={loading} tip='loading'>
        <Form labelCol={{ span: 8 }} labelAlign='left' labelWrap form={form} {...props}>
          <Flex vertical gap={20} className='w-full sm:w-[400px]'>
            <EditableFormCell
              isEditing={true}
              title='Mã Code'
              placeholder='Mã Code...'
              dataIndex='productCode'
              inputType='text'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Số lượng PO'
              dataIndex='quantityPO'
              placeholder='Số lượng PO...'
              inputType='number'
              required
            />
            <EditableFormCell
              isEditing={true}
              title='Mã màu:'
              dataIndex='colorID'
              inputType='colorselector'
              placeholder='Chọn mã màu...'
              selectProps={{
                options: colors.map((item) => {
                  return {
                    label: item.name,
                    value: item.id,
                    key: item.hexColor
                  }
                })
              }}
            />
            <EditableFormCell
              isEditing={true}
              title='Nhóm:'
              dataIndex='groupID'
              inputType='select'
              placeholder='Chọn nhóm...'
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
            <EditableFormCell
              isEditing={true}
              title='Nơi in:'
              dataIndex='printID'
              inputType='select'
              placeholder='Chọn nơi in...'
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
            <EditableFormCell
              isEditing={true}
              title='Ngày nhập NPL:'
              dataIndex='dateInputNPL'
              inputType='datepicker'
              required
              placeholder='Ngày nhập NPL...'
              initialValue={DayJS(Date.now())}
            />
            <EditableFormCell
              isEditing={true}
              title='Ngày xuất FCR:'
              dataIndex='dateOutputFCR'
              inputType='datepicker'
              required
              placeholder='Ngày xuất FCR...'
              initialValue={DayJS(Date.now())}
            />
          </Flex>
        </Form>
      </Spin>
    </Modal>
  )
}

export default memo(ModalAddNewProduct)
