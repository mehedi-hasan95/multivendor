import { useQueryStates } from "nuqs";
import { parseAsString, createLoader, parseAsArrayOf } from "nuqs/server";

export const params = {
  minPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  maxPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  tags: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
};
export const useProductFilters = () => {
  return useQueryStates(params);
};

export const loadProductFilters = createLoader(params);
