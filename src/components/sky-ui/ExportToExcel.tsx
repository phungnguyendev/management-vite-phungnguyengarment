import { Button } from 'antd'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Download } from 'lucide-react'
import { SkyTableRequiredDataType } from './SkyTable/SkyTable'

export interface ExportToExcelProps<T extends SkyTableRequiredDataType> {
  dataSource: Array<T>
  columns: Partial<ExcelJS.Column>[]
  worksheetTitle: string
  fileName: string
}

const ExportToExcel = <T extends SkyTableRequiredDataType>({
  dataSource,
  columns,
  worksheetTitle,
  fileName
}: ExportToExcelProps<T>) => {
  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const currentWorkSheet = workbook.addWorksheet(worksheetTitle)

    // Định dạng các cột
    currentWorkSheet.columns = columns

    dataSource.forEach((item) => currentWorkSheet.addRow(item))
    // Xuất file Excel
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), fileName + '.xlsx')
  }

  return (
    <>
      <Button icon={<Download size={20} />} onClick={handleExportToExcel}>
        Export to excel
      </Button>
    </>
  )
}

export default ExportToExcel
