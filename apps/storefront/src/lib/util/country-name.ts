const names = new Intl.DisplayNames(["de"], { type: "region" })

/** German country name for an ISO 3166 alpha-2 code, e.g. "de" → "Deutschland". */
export const countryName = (iso2?: string | null) => {
  if (!iso2) return ""
  try {
    return names.of(iso2.toUpperCase()) ?? iso2.toUpperCase()
  } catch {
    return iso2.toUpperCase()
  }
}
