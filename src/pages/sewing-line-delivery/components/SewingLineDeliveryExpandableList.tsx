import { Button, Collapse, Flex, List, Typography } from 'antd'
import { ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTableExpandableItemRow from '~/components/sky-ui/SkyTable/SkyTableExpandableItemRow'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableRowHighLightItem from '~/components/sky-ui/SkyTable/SkyTableRowHighLightItem'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { SewingLineDelivery } from '~/typing'
import { dateFormatter } from '~/utils/date-formatter'
import {
  dateValidatorDisplay,
  dateValidatorInit,
  expiriesDateType,
  isValidArray,
  isValidDate,
  numberValidatorCalc,
  numberValidatorDisplay,
  numberValidatorInit
} from '~/utils/helpers'
import { SewingLineDeliveryTableDataType } from '../type'
import SewingLineDeliveryExpiresError from './SewingLineDeliveryExpiresError'

interface Props {
  isEditing: boolean
  parentRecord: SewingLineDeliveryTableDataType
  newRecord: SewingLineDelivery[] | null
  setNewRecord: React.Dispatch<React.SetStateAction<SewingLineDelivery[] | null>>
}

const SewingLineDeliveryExpandableList: React.FC<Props> = ({ parentRecord, newRecord, setNewRecord, isEditing }) => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])

  const expandableListColumn = {
    quantityOriginal: (record: SewingLineDelivery) => {
      return (
        <EditableStateCell
          isEditing={isEditing}
          dataIndex='quantityOriginal'
          title='SL Vào chuyền'
          inputType='number'
          required
          placeholder='Ví dụ: 1000'
          defaultValue={numberValidatorInit(record.quantityOriginal)}
          value={
            isValidArray(newRecord)
              ? newRecord.find((i) => i.sewingLineID === record.sewingLineID)?.quantityOriginal
              : undefined
          }
          onValueChange={(val: number) => {
            setNewRecord((prevNewRecord) => {
              return prevNewRecord!.map((item) => {
                return item.sewingLineID === record.sewingLineID
                  ? ({ ...item, quantityOriginal: val } as SewingLineDelivery)
                  : item
              })
            })
          }}
        >
          <SkyTableTypography>{numberValidatorDisplay(record?.quantityOriginal)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantitySewed: (record: SewingLineDelivery) => {
      return (
        <EditableStateCell
          isEditing={isEditing}
          dataIndex='quantitySewed'
          title='May được'
          inputType='number'
          required
          placeholder='Ví dụ: 1000'
          defaultValue={numberValidatorInit(record.quantitySewed)}
          value={
            isValidArray(newRecord)
              ? newRecord.find((i) => i.sewingLineID === record.sewingLineID)?.quantitySewed
              : undefined
          }
          onValueChange={(val: number) => {
            setNewRecord((prevNewRecord) => {
              return prevNewRecord!.map((item) => {
                return item.sewingLineID === record.sewingLineID
                  ? ({ ...item, quantitySewed: val } as SewingLineDelivery)
                  : item
              })
            })
          }}
        >
          <SkyTableTypography>{numberValidatorDisplay(record?.quantitySewed)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    amountQuantity: (record: SewingLineDelivery) => {
      return (
        <SkyTableTypography>
          {numberValidatorDisplay(
            numberValidatorCalc(record.quantityOriginal) - numberValidatorCalc(record.quantitySewed)
          )}
        </SkyTableTypography>
      )
    },
    expiredDate: (record: SewingLineDelivery) => {
      return (
        <EditableStateCell
          isEditing={isEditing}
          dataIndex='expiredDate'
          title='Ngày dự kiến hoàn thành'
          inputType='datepicker'
          required
          defaultValue={dateValidatorInit(record.expiredDate)}
          onValueChange={(val: number) => {
            setNewRecord((prevNewRecord) => {
              return prevNewRecord!.map((item) => {
                return item.sewingLineID === record.sewingLineID
                  ? ({ ...item, expiredDate: dateFormatter(val, 'iso8601') } as SewingLineDelivery)
                  : item
              })
            })
          }}
        >
          <SkyTableTypography>
            {dateValidatorDisplay(record?.expiredDate)}{' '}
            {isValidDate(parentRecord.dateOutputFCR) && isValidDate(record.expiredDate) && (
              <SewingLineDeliveryExpiresError
                dateOutputFCR={parentRecord.dateOutputFCR}
                dateToCheck={record.expiredDate}
              />
            )}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const handleButtonHide = () => {
    setActiveKey([])
  }

  return (
    <>
      <Collapse
        // ={viewModel.table.isEditing(record.key)}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        items={[
          {
            key: '1',
            label: (
              <Typography.Title className='m-0' level={5} type='secondary'>
                Danh sách chuyền may
              </Typography.Title>
            ),
            children: (
              <SkyTableExpandableLayout>
                <List
                  itemLayout='vertical'
                  dataSource={parentRecord.sewingLineDeliveries}
                  renderItem={(record, index) => (
                    <List.Item key={index}>
                      <Flex vertical gap={20} align='center' className='w-full'>
                        <SkyTableRowHighLightItem
                          key={index}
                          status={record.sewingLine?.status}
                          type={
                            expiriesDateType(parentRecord.dateOutputFCR, record.expiredDate) === 'danger'
                              ? 'danger'
                              : 'secondary'
                          }
                          className='w-fit'
                        >
                          {expiriesDateType(parentRecord.dateOutputFCR, record.expiredDate) === 'danger'
                            ? `${record.sewingLine?.name} (Bể)`
                            : `${record.sewingLine?.name}`}{' '}
                          {isValidDate(parentRecord.dateOutputFCR) && isValidDate(record.expiredDate) && (
                            <SewingLineDeliveryExpiresError
                              dateOutputFCR={parentRecord.dateOutputFCR}
                              dateToCheck={record.expiredDate}
                            />
                          )}
                        </SkyTableRowHighLightItem>
                        <SkyTableExpandableItemRow
                          className='w-[100px] md:w-[250px]'
                          title='SL vào chuyền:'
                          isEditing={isEditing}
                        >
                          {expandableListColumn.quantityOriginal(record)}
                        </SkyTableExpandableItemRow>
                        <SkyTableExpandableItemRow
                          className='w-[100px] md:w-[250px]'
                          title='SL may được:'
                          isEditing={isEditing}
                        >
                          {expandableListColumn.quantitySewed(record)}
                        </SkyTableExpandableItemRow>
                        <SkyTableExpandableItemRow
                          className='w-[100px] md:w-[250px]'
                          title='SL còn lại:'
                          isEditing={isEditing}
                        >
                          {expandableListColumn.amountQuantity(record)}
                        </SkyTableExpandableItemRow>
                        <SkyTableExpandableItemRow
                          className='w-[100px] md:w-[250px]'
                          title='Ngày dự kiến hoàn thành:'
                          subTitle='(Phải cách FCR 5 ngày)'
                          isEditing={isEditing}
                        >
                          {expandableListColumn.expiredDate(record)}
                        </SkyTableExpandableItemRow>
                      </Flex>
                    </List.Item>
                  )}
                />
                <Button className='w-full' type='link' onClick={handleButtonHide}>
                  <Flex justify='center' align='center' gap={5}>
                    <ChevronUp size={20} />
                    Hide
                  </Flex>
                </Button>
              </SkyTableExpandableLayout>
            )
          }
        ]}
      />
    </>
  )
}

export default SewingLineDeliveryExpandableList
