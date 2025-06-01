interface ProductLayoutProps {
  children: React.ReactNode;
}
const ProductLayout = async ({ children }: ProductLayoutProps) => {
  return <>{children}</>;
};

export default ProductLayout;
