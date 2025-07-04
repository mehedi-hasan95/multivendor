import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

const sortValues = ["trending", "best_seller", "hot_and_new"] as const;
export const params = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  minPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  maxPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  tags: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault("trending"),
};
export const useProductFilters = () => {
  return useQueryStates(params);
};
