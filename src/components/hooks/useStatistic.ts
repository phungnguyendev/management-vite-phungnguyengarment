import { Completion, Product, SewingLineDelivery, TableStatusType } from '~/typing'
import { expiriesDateType, isExpiredDate, numberValidatorCalc, percentage, sumArray } from '~/utils/helpers'

export default function useStatistic() {
  // Check sl may đã đạt hay chưa
  const sewPassed = (quantityPO?: number, quantitySewed?: number): boolean => {
    return numberValidatorCalc(quantitySewed) >= numberValidatorCalc(quantityPO)
  }

  // Check sl ủi đã đạt hay chưa
  const ironPassed = (quantityPO?: number, quantityIroned?: number): boolean => {
    return numberValidatorCalc(quantityIroned) >= numberValidatorCalc(quantityPO)
  }

  // Check sl kiểm đã đạt hay chưa
  const checkPassed = (quantityPO?: number, quantityCheckPass?: number): boolean => {
    return numberValidatorCalc(quantityCheckPass) >= numberValidatorCalc(quantityPO)
  }

  // Check sl đóng gói đã đạt hay chưa
  const packagePassed = (quantityPO?: number, quantityPackage?: number): boolean => {
    return numberValidatorCalc(quantityPackage) >= numberValidatorCalc(quantityPO)
  }

  // Tổng số lượng đã may
  const sumQuantitySewed = (productID: number, sewingLineDeliveries: SewingLineDelivery[]): number => {
    return sumArray(
      sewingLineDeliveries
        .filter((item) => item.productID === productID)
        .map((item) => {
          return item.quantitySewed ?? 0
        })
    )
  }

  // Tổng số lượng đã ủi
  const sumQuantityIroned = (productID: number, completions: Completion[]): number => {
    return sumArray(
      completions
        .filter((item) => item.productID === productID)
        .map((item) => {
          return item.quantityIroned ?? 0
        })
    )
  }

  // Tổng số lượng đã kiểm
  const sumQuantityCheckPassed = (productID: number, completions: Completion[]): number => {
    return sumArray(
      completions
        .filter((item) => item.productID === productID)
        .map((item) => {
          return item.quantityCheckPassed ?? 0
        })
    )
  }

  // Tổng số lượng đã đóng gói
  const sumQuantityPackaged = (productID: number, completions: Completion[]): number => {
    return sumArray(
      completions
        .filter((item) => item.productID === productID)
        .map((item) => {
          return item.quantityPackaged ?? 0
        })
    )
  }

  // Tổng số lượng mã đã hoàn thành (May 100%, Ủi 100%, Kiểm 100%, Đóng gói 100%)
  const amountProductCompleted = (
    products: Product[],
    sewingLineDeliveries: SewingLineDelivery[],
    completions: Completion[]
  ): number => {
    return products.filter((product) => {
      return (
        sewPassed(product.id, sumQuantitySewed(numberValidatorCalc(product.id), sewingLineDeliveries)) &&
        ironPassed(product.id, sumQuantityIroned(numberValidatorCalc(product.id), completions)) &&
        ironPassed(product.id, sumQuantityCheckPassed(numberValidatorCalc(product.id), completions)) &&
        ironPassed(product.id, sumQuantityPackaged(numberValidatorCalc(product.id), completions))
      )
    }).length
  }

  // Tổng số lượng mã đang may | đang ủi | đang kiểm | đang đóng gói
  const amountProductProgressing = (
    products: Product[],
    sewingLineDeliveries: SewingLineDelivery[],
    completions: Completion[]
  ): number => {
    return products.filter((product) => {
      return (
        !sewPassed(product.id, sumQuantitySewed(numberValidatorCalc(product.id), sewingLineDeliveries)) ||
        !ironPassed(product.id, sumQuantityIroned(numberValidatorCalc(product.id), completions)) ||
        !ironPassed(product.id, sumQuantityCheckPassed(numberValidatorCalc(product.id), completions)) ||
        !ironPassed(product.id, sumQuantityPackaged(numberValidatorCalc(product.id), completions))
      )
    }).length
  }

  // Tổng số lượng sl may được, sl ủi, sl kiểm, sl đóng gói < quantityPO và ngày dự kiến hoành thành <= 5 so với ngày xuất FCR
  const amountProductDangerous = (
    products: Product[],
    sewingLineDeliveries: SewingLineDelivery[],
    completions: Completion[]
  ): number => {
    return products.filter((product) => {
      return (
        (!sewPassed(product.id, sumQuantitySewed(numberValidatorCalc(product.id), sewingLineDeliveries)) ||
          !ironPassed(product.id, sumQuantityIroned(numberValidatorCalc(product.id), completions)) ||
          !ironPassed(product.id, sumQuantityCheckPassed(numberValidatorCalc(product.id), completions)) ||
          !ironPassed(product.id, sumQuantityPackaged(numberValidatorCalc(product.id), completions))) &&
        sewingLineDeliveries
          .filter((item) => item.productID === product.id)
          .some((item) => isExpiredDate(product.dateOutputFCR, item.expiredDate))
      )
    }).length
  }

  /**
   * Hàm dùng để kiểm tra xem có nên hiển thị IconStatus hay không
   */
  const isShowStatusIcon = (
    productID: number,
    sewingLineDeliveries: SewingLineDelivery[],
    completions: Completion[]
  ): boolean => {
    // Luôn show status icon, ngoại trừ mã sản phẩm mới thêm và chưa có thông tin may, ủi, kiểm hay đóng gói
    return (
      sumQuantitySewed(productID, sewingLineDeliveries) > 0 ||
      sumQuantityIroned(productID, completions) > 0 ||
      sumQuantityCheckPassed(productID, completions) > 0 ||
      sumQuantityPackaged(productID, completions) > 0
    )
  }

  /**
   * Hàm dùng để kiểm tra xem nên hiển thị loại icon nào
   */
  const statusIconType = (
    record: Product,
    sewingLineDeliveries: SewingLineDelivery[],
    completions: Completion[]
  ): TableStatusType => {
    // Success: sewed && ironed && checkPass && packaged === 100%
    if (
      sewPassed(record.quantityPO, sumQuantitySewed(record.id!, sewingLineDeliveries)) &&
      ironPassed(record.quantityPO, sumQuantityIroned(record.id!, completions)) &&
      checkPassed(record.quantityPO, sumQuantityCheckPassed(record.id!, completions)) &&
      packagePassed(record.quantityPO, sumQuantityPackaged(record.id!, completions)) &&
      sewingLineDeliveries
        .filter((item) => item.productID === record.id)
        .some((item) => !isExpiredDate(record.dateOutputFCR, item.expiredDate))
    )
      return 'success'
    // Error: (sewed, ironed, checkPass, packaged < 50%) && expired
    else if (
      percentage(
        numberValidatorCalc(record.quantityPO),
        sumQuantitySewed(numberValidatorCalc(record.id), sewingLineDeliveries)
      ) < 50 &&
      percentage(
        numberValidatorCalc(record.quantityPO),
        sumQuantityIroned(numberValidatorCalc(record.id), completions)
      ) < 50 &&
      percentage(
        numberValidatorCalc(record.quantityPO),
        sumQuantityCheckPassed(numberValidatorCalc(record.id), completions)
      ) < 50 &&
      percentage(
        numberValidatorCalc(record.quantityPO),
        sumQuantityPackaged(numberValidatorCalc(record.id), completions)
      ) < 50 &&
      sewingLineDeliveries
        .filter((item) => item.productID === record.id)
        .some((item) => expiriesDateType(record.dateOutputFCR, item.expiredDate) === 'danger')
    )
      return 'danger'
    // Waring: (sewed | ironed | checkPass | packaged) < 100%
    else if (
      percentage(numberValidatorCalc(record.quantityPO), sumQuantitySewed(record.id!, sewingLineDeliveries)) < 100 &&
      percentage(numberValidatorCalc(record.quantityPO), sumQuantityIroned(record.id!, completions)) < 100 &&
      percentage(numberValidatorCalc(record.quantityPO), sumQuantityCheckPassed(record.id!, completions)) < 100 &&
      percentage(numberValidatorCalc(record.quantityPO), sumQuantityPackaged(record.id!, completions)) < 100
    )
      return 'warning'
    // Secondary: sewed, ironed, checkPass, packaged === 0%
    else {
      return 'normal'
    }
  }

  return {
    sewPassed,
    ironPassed,
    checkPassed,
    packagePassed,
    sumQuantitySewed,
    sumQuantityIroned,
    sumQuantityCheckPassed,
    sumQuantityPackaged,
    amountProductCompleted,
    amountProductProgressing,
    amountProductDangerous,
    isShowStatusIcon,
    statusIconType
  }
}
