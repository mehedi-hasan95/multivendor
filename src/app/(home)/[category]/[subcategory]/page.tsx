import GradientText from "@/components/generated/gradient-text";
import { ProductList } from "../../_components/common/product/product-list";
import { ShortFilter } from "../../_components/common/product/sort-filter";
import { ProductFilters } from "../../_components/common/product/products-filter";
import { Suspense } from "react";

const SubCategoryPage = () => {
  return (
    <div className="mx-4 lg:mx-12">
      <div className="flex justify-between items-center pb-5">
        <GradientText element="H1">On the market</GradientText>
        <ShortFilter />
      </div>
      <div className="grid grid-cols-8 gap-4 col-span-full lg:col-span-4">
        <div className="col-span-full sm:col-span-2">
          <ProductFilters />
        </div>
        <div className="col-span-full sm:col-span-6">
          <Suspense>
            <ProductList isManual={true} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
