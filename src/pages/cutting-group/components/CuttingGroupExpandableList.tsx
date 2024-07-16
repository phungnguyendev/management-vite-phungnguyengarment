import { Button, Collapse, Flex, List, Typography } from 'antd'
import { Dayjs } from 'dayjs'
import { ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTableExpandableLayout from '~/components/sky-ui/SkyTable/SkyTableExpandableLayout'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  isValidDate,
  isValidNumber,
  isValidObject,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit
} from '~/utils/helpers'
import { CuttingGroupNewRecordProps, CuttingGroupTableDataType } from '../type'

interface Props {
  isEditing: boolean
  disabled: boolean
  record: CuttingGroupTableDataType
  newRecord: CuttingGroupNewRecordProps | null
  setNewRecord: React.Dispatch<React.SetStateAction<CuttingGroupNewRecordProps | null>>
}

interface DataType {
  quantityArrived?: number
  dateArrived?: string
}

const CuttingGroupExpandableList: React.FC<Props> = ({ record, newRecord, setNewRecord, isEditing, disabled }) => {
  const [more, setMore] = useState<boolean>(() => {
    return (
      isValidObject(record.cuttingGroup) &&
      (isValidNumber(record.cuttingGroup.quantityArrived6Th) ||
        isValidDate(record.cuttingGroup.dateArrived6Th) ||
        isValidNumber(record.cuttingGroup.quantityArrived7Th) ||
        isValidDate(record.cuttingGroup.dateArrived7Th) ||
        isValidNumber(record.cuttingGroup.quantityArrived8Th) ||
        isValidDate(record.cuttingGroup.dateArrived8Th) ||
        isValidNumber(record.cuttingGroup.quantityArrived9Th) ||
        isValidDate(record.cuttingGroup.dateArrived9Th) ||
        isValidNumber(record.cuttingGroup.quantityArrived10Th) ||
        isValidDate(record.cuttingGroup.dateArrived10Th))
    )
  })
  const [activeKey, setActiveKey] = useState<string | string[]>([])

  const dataOriginal: DataType[] = [
    {
      quantityArrived: record.cuttingGroup?.quantityArrived1Th,
      dateArrived: record.cuttingGroup?.dateArrived1Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived2Th,
      dateArrived: record.cuttingGroup?.dateArrived2Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived3Th,
      dateArrived: record.cuttingGroup?.dateArrived3Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived4Th,
      dateArrived: record.cuttingGroup?.dateArrived4Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived5Th,
      dateArrived: record.cuttingGroup?.dateArrived5Th
    }
  ]

  const dataMore: DataType[] = [
    {
      quantityArrived: record.cuttingGroup?.quantityArrived6Th,
      dateArrived: record.cuttingGroup?.dateArrived6Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived7Th,
      dateArrived: record.cuttingGroup?.dateArrived7Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived8Th,
      dateArrived: record.cuttingGroup?.dateArrived8Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived9Th,
      dateArrived: record.cuttingGroup?.dateArrived9Th
    },
    {
      quantityArrived: record.cuttingGroup?.quantityArrived10Th,
      dateArrived: record.cuttingGroup?.dateArrived10Th
    }
  ]

  const handleButtonHide = () => {
    setActiveKey([])
  }

  const getNewRecord = (
    index: number
  ): {
    quantityArrived?: number
    dateArrived?: string
  } => {
    switch (index) {
      case 0:
        return {
          quantityArrived: newRecord?.quantityArrived1Th,
          dateArrived: newRecord?.dateArrived1Th
        }
      case 1:
        return {
          quantityArrived: newRecord?.quantityArrived2Th,
          dateArrived: newRecord?.dateArrived2Th
        }
      case 2:
        return {
          quantityArrived: newRecord?.quantityArrived3Th,
          dateArrived: newRecord?.dateArrived3Th
        }
      case 3:
        return {
          quantityArrived: newRecord?.quantityArrived4Th,
          dateArrived: newRecord?.dateArrived4Th
        }
      case 4:
        return {
          quantityArrived: newRecord?.quantityArrived5Th,
          dateArrived: newRecord?.dateArrived5Th
        }
      case 5:
        return {
          quantityArrived: newRecord?.quantityArrived6Th,
          dateArrived: newRecord?.dateArrived6Th
        }
      case 6:
        return {
          quantityArrived: newRecord?.quantityArrived7Th,
          dateArrived: newRecord?.dateArrived7Th
        }
      case 7:
        return {
          quantityArrived: newRecord?.quantityArrived8Th,
          dateArrived: newRecord?.dateArrived8Th
        }
      case 8:
        return {
          quantityArrived: newRecord?.quantityArrived9Th,
          dateArrived: newRecord?.dateArrived9Th
        }
      default:
        return {
          quantityArrived: newRecord?.quantityArrived10Th,
          dateArrived: newRecord?.dateArrived10Th
        }
    }
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
                Số lần in thêu về
              </Typography.Title>
            ),
            children: (
              <SkyTableExpandableLayout>
                <List
                  itemLayout='vertical'
                  dataSource={more ? [...dataOriginal, ...dataMore] : dataOriginal}
                  renderItem={(record, index) => (
                    <List.Item key={index}>
                      <Flex className='w-full'>
                        <SkyTableTypography strong className='w-2/3 md:w-1/2' code disabled={disabled}>
                          Lần {index + 1}:
                        </SkyTableTypography>
                        <Flex vertical className='w-full' gap={20}>
                          <Flex className='w-full flex-col lg:flex-row' gap={5}>
                            <Flex vertical className='w-full'>
                              <SkyTableTypography strong disabled={disabled}>
                                SL in thêu về:
                              </SkyTableTypography>
                            </Flex>
                            <Flex className='h-fit w-full'>
                              <EditableStateCell
                                isEditing={isEditing}
                                dataIndex='quantityArrived'
                                title='Thực cắt'
                                inputType='number'
                                required
                                disabled={disabled}
                                placeholder='Ví dụ: 500'
                                defaultValue={numberValidatorInit(record.quantityArrived)}
                                value={getNewRecord(index).quantityArrived}
                                onValueChange={(val) =>
                                  setNewRecord((prev) => {
                                    return { ...prev, [`quantityArrived${index + 1}Th`]: numberValidatorChange(val) }
                                  })
                                }
                              >
                                <SkyTableTypography disabled={disabled}>
                                  {numberValidatorDisplay(record.quantityArrived)}
                                </SkyTableTypography>
                              </EditableStateCell>
                            </Flex>
                          </Flex>
                          <Flex className='w-full flex-col lg:flex-row' gap={5}>
                            <Flex vertical className='w-full'>
                              <SkyTableTypography strong disabled={disabled}>
                                Ngày về:
                              </SkyTableTypography>
                            </Flex>
                            <Flex className='h-fit w-full'>
                              <EditableStateCell
                                isEditing={isEditing}
                                dataIndex='dateArrived'
                                title='Ngày về'
                                inputType='datepicker'
                                required
                                disabled={disabled}
                                defaultValue={dateValidatorInit(record.dateArrived)}
                                onValueChange={(val: Dayjs) =>
                                  setNewRecord({
                                    ...newRecord,
                                    [`dateArrived${index + 1}Th`]: dateValidatorChange(val)
                                  })
                                }
                              >
                                <SkyTableTypography disabled={disabled}>
                                  {dateValidatorDisplay(record.dateArrived)}
                                </SkyTableTypography>
                              </EditableStateCell>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </List.Item>
                  )}
                />
                {!more && (
                  <Button type='dashed' disabled={!isEditing} className='h-[64px] w-full' onClick={() => setMore(true)}>
                    + 5 item
                  </Button>
                )}
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

export default CuttingGroupExpandableList
