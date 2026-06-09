// ---------------------------------------------------------------------------
// Blocmate CORE100 coverage math — preserved exactly from the original app.
// ---------------------------------------------------------------------------

/** Approximate coverage rate: square metres sealed per litre, per coat. */
export const COVERAGE_PER_LITRE = 6

/** Litres in one US gallon (used for the gallon read-out). */
export const LITRES_PER_GALLON = 3.78541

/** Available product container sizes (SKUs). */
export const CONTAINERS = [
  { label: '1L', liters: 1 },
  { label: '4.5L', liters: 4.5 },
  { label: '22L', liters: 22 },
]

/**
 * AREA mode — given a surface area, how much product is needed and which
 * container SKU is the most efficient choice.
 *
 * @param {number} area   surface area in m²
 * @param {number} coats  number of coats (1–3)
 * @param {number} buffer extra allowance, as a percentage (0–20)
 */
export function calcByArea(area, coats, buffer) {
  const safeArea = parseInt(area) || 1
  const litersNeeded = ((safeArea * coats) / COVERAGE_PER_LITRE) * (1 + buffer / 100)
  const gallonsNeeded = litersNeeded / LITRES_PER_GALLON

  const skuEstimates = CONTAINERS.map((c) => {
    const units = Math.ceil(litersNeeded / c.liters)
    const totalLiters = units * c.liters
    const leftover = totalLiters - litersNeeded
    return { ...c, units, totalLiters, leftover }
  })

  // Pick the SKU with the least waste, ignoring impractical quantities
  // (too many small tins). Falls back to the smallest container.
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

  return {
    litersNeeded,
    gallonsNeeded,
    skuEstimates,
    recommended,
  }
}

/**
 * VOLUME mode — given a quantity of product, how much area can it cover.
 *
 * @param {number} containerIndex index into CONTAINERS
 * @param {number} count          number of containers
 * @param {number} coats          number of coats (1–3)
 */
export function calcByVolume(containerIndex, count, coats) {
  const container = CONTAINERS[containerIndex]
  const units = parseInt(count) || 1
  const totalLiters = container.liters * units
  const gallonsTotal = totalLiters / LITRES_PER_GALLON
  const coverage = (totalLiters * COVERAGE_PER_LITRE) / coats

  return {
    totalLiters,
    gallonsTotal,
    coverage,
    skuLabel: container.label,
  }
}
