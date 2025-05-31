import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface Props {
  img: string | null;
}
export const AuthorImg = ({ img }: Props) => {
  return (
    <Avatar>
      <AvatarImage
        className="size-8"
        src={img ? img : "https://github.com/shadcn.png"}
        alt="@shadcn"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
