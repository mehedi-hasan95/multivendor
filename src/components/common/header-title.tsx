import Link from "next/link";

interface HeaderTitleProps {
  title: string;
  description?: string;
  linkHref: string;
  linkText: string;
}
export const HeaderTitle = ({
  linkHref,
  linkText,
  title,
  description,
}: HeaderTitleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      <Link
        className="bg-slate-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-slate-800 transition-colors duration-200"
        href={linkHref}
      >
        {linkText}
      </Link>
    </div>
  );
};
