// ---------------------------------------------------------------------------
// Blocmate CORE100 coverage + cost math.
// ---------------------------------------------------------------------------
import { CONTAINERS, LITRES_PER_GALLON, POROSITY } from './config'
import { netArea } from './geometry'

export { CONTAINERS, LITRES_PER_GALLON } from './config'

/** Coverage rate (m² per litre per coat) for a porosity key. */
export function coverageRate(porosity) {
  return (POROSITY[porosity] || POROSITY.medium).rate
}

/** Litres needed to seal a single surface (area × coats ÷ coverage rate). */
export function surfaceLitres(surface) {
  return (netArea(surface) * surface.coats) / coverageRate(surface.porosity)
}

/**
 * Size up every container SKU for a required litre figure and pick the most
 * efficient one (least leftover, ignoring impractical piles of small tins).
 */
export function recommendSku(litersNeeded) {
  const skuEstimates = CONTAINERS.map((c) => {
    const units = Math.ceil(litersNeeded / c.liters)
    const totalLiters = units * c.liters
    return { ...c, units, totalLiters, leftover: totalLiters - litersNeeded }
  })

  const recommended =
    [...skuEstimates]
      .filter(
        (e) =>
          !(
            e.totalLiters < litersNeeded ||
            (e.liters === 1 && e.units >= 7) ||
            (e.liters === 4.5 && e.units >= 9)
          ),
      )
      .sort((a, b) =>
        a.leftover !== b.leftover
          ? a.leftover - b.leftover
          : a.units !== b.units
            ? a.units - b.units
            : b.liters - a.liters,
      )[0] || skuEstimates[0]

  return { skuEstimates, recommended }
}

/**
 * Roll a whole project (one or more surfaces) up into a buy recommendation.
 *
 * @param {Array}  surfaces list of surface objects
 * @param {number} buffer   global safety buffer, as a percentage (0–20)
 * @param {object} prices   { '1L': n, '4.5L': n, '22L': n } — optional
 */
export function calcProject(surfaces, buffer, prices = {}) {
  const totalArea = surfaces.reduce((a, s) => a + netArea(s), 0)
  const baseLiters = surfaces.reduce((a, s) => a + surfaceLitres(s), 0)
  const litersNeeded = baseLiters * (1 + buffer / 100)
  const gallonsNeeded = litersNeeded / LITRES_PER_GALLON

  const { skuEstimates, recommended } = recommendSku(litersNeeded)
  const withCost = (e) => ({ ...e, cost: lineCost(e, prices) })

  const pricedEstimates = skuEstimates.map(withCost)
  const pricedRecommended = withCost(recommended)

  return {
    totalArea,
    litersNeeded,
    gallonsNeeded,
    skuEstimates: pricedEstimates,
    recommended: pricedRecommended,
    totalCost: pricedRecommended.cost,
    costPerSqm:
      pricedRecommended.cost != null && totalArea > 0
        ? pricedRecommended.cost / totalArea
        : null,
  }
}

/** Cost of buying `units` of a SKU, or null when no price is set. */
function lineCost(estimate, prices) {
  const price = parseFloat(prices?.[estimate.label])
  return Number.isFinite(price) && price > 0 ? estimate.units * price : null
}

/**
 * VOLUME mode — given a quantity of product, how much area it covers.
 */
export function calcByVolume(containerIndex, count, coats, porosity) {
  const container = CONTAINERS[containerIndex]
  const units = parseInt(count) || 1
  const totalLiters = container.liters * units
  const gallonsTotal = totalLiters / LITRES_PER_GALLON
  const coverage = (totalLiters * coverageRate(porosity)) / coats

  return { totalLiters, gallonsTotal, coverage, skuLabel: container.label }
}
