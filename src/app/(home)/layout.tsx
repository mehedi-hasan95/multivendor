import { Footer } from "./_components/common/footer";
import { HomeHeaders } from "./_components/common/home-headers";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <HomeHeaders />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
