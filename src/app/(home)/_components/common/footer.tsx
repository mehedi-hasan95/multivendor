import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex justify-center py-3">
      <span>
        &copy; {new Date().getFullYear()} All right reserved by{" "}
        <Link
          href={"https://mehedi95.vercel.app/"}
          target="_blank"
          className="text-blue-500"
        >
          Mehedi
        </Link>
      </span>
    </footer>
  );
};
