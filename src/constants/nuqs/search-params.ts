import {
  parseAsString,
  createLoader,
  parseAsArrayOf,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortValues = ["trending", "best_seller", "hot_and_new"] as const;
const params = {
  minPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  maxPrice: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  tags: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault("trending"),
};
export const loadProductFilters = createLoader(params);
