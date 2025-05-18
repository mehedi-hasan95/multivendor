import { Categories, SubCategories } from "@/generated/prisma";

export type CategoriesType = Categories & { SubCategories: SubCategories[] };
