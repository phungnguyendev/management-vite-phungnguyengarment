import { Completion, SewingLineDelivery } from '~/typing'
import { numberValidatorCalc, sumArray } from '~/utils/helpers'

export default function useStatistic() {
  const isValidQuantity = (quantityPO: number, quantity: number): boolean => {
    return quantity > 0 && quantity < quantityPO
  }

  // Check sl may đã đạt hay chưa
  const sewPassed = (quantityPO: number, quantitySewed: number): boolean => {
    return numberValidatorCalc(quantitySewed) >= numberValidatorCalc(quantityPO)
  }

  // Check sl ủi đã đạt hay chưa
  const ironPassed = (quantityPO: number, quantityIroned: number): boolean => {
    return numberValidatorCalc(quantityIroned) >= numberValidatorCalc(quantityPO)
  }

  // Check sl kiểm đã đạt hay chưa
  const checkPassed = (quantityPO: number, quantityCheckPass: number): boolean => {
    return numberValidatorCalc(quantityCheckPass) >= numberValidatorCalc(quantityPO)
  }

  // Check sl đóng gói đã đạt hay chưa
  const packagePassed = (quantityPO: number, quantityPackage: number): boolean => {
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

  return {
    isValidQuantity,
    sewPassed,
    ironPassed,
    checkPassed,
    packagePassed,
    sumQuantitySewed,
    sumQuantityIroned,
    sumQuantityCheckPassed,
    sumQuantityPackaged
  }
}
