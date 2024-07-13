import { Button } from 'antd'
import React from 'react'
import { ExportAsExcel as ExportAsExcelTool } from 'react-export-table'
import { dateFormatter } from '~/utils/date-formatter'

export interface ExportToExcelProps {
  dataSource: Array<any>
  headers: string[]
  name?: string
  minColumnWidth?: number
  fileName?: string
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ dataSource, headers, name, minColumnWidth, fileName }) => {
  return (
    <>
      <ExportAsExcelTool
        data={dataSource}
        headers={headers}
        name={name ?? ''}
        fileName={`${fileName}_${dateFormatter(Date.now(), 'dateTime')}`}
        minColumnWidth={minColumnWidth ?? 10}
      >
        {(childrenProps) => (
          <Button {...childrenProps} type='dashed'>
            Export to excel
          </Button>
        )}
      </ExportAsExcelTool>
    </>
  )
}

export default ExportToExcel
