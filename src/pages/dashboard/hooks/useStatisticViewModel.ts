import { useCallback, useEffect, useState } from 'react'
import CompletionAPI from '~/api/services/CompletionAPI'
import ProductAPI from '~/api/services/ProductAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import useAPIService from '~/hooks/useAPIService'
import { Completion, Product, SewingLineDelivery } from '~/typing'
import { isValidNumber, isValidObject, sumArray } from '~/utils/helpers'

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

  const sumProductCompleted = (): number => {
    const listCompletion = completions.filter((item) => {
      const quantityPO =
        isValidObject(item.product) && isValidNumber(item.product.quantityPO) ? item.product.quantityPO : 0
      return (
        item.quantityIroned === quantityPO &&
        item.quantityCheckPassed === quantityPO &&
        item.quantityPackaged === quantityPO &&
        sumArray(
          sewingLineDeliveries
            .filter((self) => self.productID === item.productID)
            .map((self) => {
              return self.quantitySewed ?? 0
            })
        ) === quantityPO
      )
    })
    return listCompletion.length
  }

  const sumProductProgressing = (): number => {
    return products.length
  }

  const sumProductError = (): number => {
    return products.length
  }

  return {
    loading,
    sumProductAll,
    sumProductCompleted,
    sumProductError,
    sumProductProgressing
  }
}
