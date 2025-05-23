import { ProductFilters } from "./_components/common/product/products-filter";

export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <div className="grid grid-cols-8 gap-4 col-span-full lg:col-span-4 mx-4 lg:mx-12">
      <div className="col-span-full sm:col-span-2">
        <ProductFilters />
      </div>
      <div className="col-span-full sm:col-span-6">Mehedi</div>
    </div>
  );
}
