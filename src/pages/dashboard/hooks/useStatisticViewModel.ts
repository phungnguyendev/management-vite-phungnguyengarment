import { useCallback, useEffect, useState } from 'react'
import CompletionAPI from '~/api/services/CompletionAPI'
import ProductAPI from '~/api/services/ProductAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useAPIService from '~/hooks/useAPIService'
import { Completion, Product, SewingLineDelivery } from '~/typing'
import { isExpiredDate, numberValidatorCalc, sumArray } from '~/utils/helpers'

export default function useStatisticViewModel() {
  const productService = useAPIService<Product>(ProductAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)

  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const [products, setProducts] = useState<Product[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])

  useEffect(() => {
    initialize()
  }, [])

  /**
   * Initialize function
   */
  const initialize = useCallback(async () => {
    try {
      const productsResult = await productService.getItems(
        { paginator: { page: 1, pageSize: -1 }, filter: { status: ['active', 'deleted'], field: 'id', items: [-1] } },
        setLoading
      )
      const newProducts = productsResult.data as Product[]
      setProducts(newProducts)

      const completionsResult = await completionService.getItems({ paginator: { page: 1, pageSize: -1 } }, setLoading)
      const newCompletions = completionsResult.data as Completion[]
      setCompletions(newCompletions)

      const sewingLineDeliveriesResult = await sewingLineDeliveryService.getItems(
        { paginator: { page: 1, pageSize: -1 } },
        setLoading
      )
      const newSewingLineDeliveries = sewingLineDeliveriesResult.data as SewingLineDelivery[]
      setSewingLineDeliveries(newSewingLineDeliveries)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const sumProductAll = (): number => {
    return products.length
  }

  // Mã đã hoàn thành (May 100%, Ủi 100%, Kiểm 100%, Đóng gói 100%)
  // Sum = May, Ủi, Kiểm, Đóng gói >= quantityPO
  const sumProductCompleted = (): number => {
    return products.filter((product) => {
      const quantityPO = numberValidatorCalc(product.quantityPO)
      // Danh sách may được
      const isQuantitySewedSuccess =
        sumArray(
          sewingLineDeliveries
            .filter((item) => item.productID === product.id)
            .map((item) => {
              return item.quantitySewed ?? 0
            })
        ) >= quantityPO
      const isCompletionSuccess = completions
        .filter((item) => item.productID === product.id)
        .some(
          (item) =>
            numberValidatorCalc(item.quantityIroned) >= quantityPO &&
            numberValidatorCalc(item.quantityCheckPassed) >= quantityPO &&
            numberValidatorCalc(item.quantityPackaged) >= quantityPO
        )
      return isQuantitySewedSuccess && isCompletionSuccess
    }).length
  }

  const sumProductProgressing = (): number => {
    return products.filter((product) => {
      const isQuantitySewedSuccess =
        sumArray(
          sewingLineDeliveries
            .filter((item) => item.productID === product.id)
            .map((item) => {
              return item.quantitySewed ?? 0
            })
        ) < numberValidatorCalc(product.quantityPO)

      return isQuantitySewedSuccess
    }).length
  }

  const sumProductError = (): number => {
    return products.filter((product) => {
      const sewingLines = sewingLineDeliveries.filter((item) => item.productID === product.id)
      return sewingLines.some((item) => isExpiredDate(product.dateOutputFCR, item.expiredDate))
    }).length
  }

  return {
    loading,
    sumProductAll,
    sumProductCompleted,
    sumProductError,
    sumProductProgressing
  }
}
