import { authSession } from "@/lib/auth-session";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = async () => {
  const session = await authSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized User");
  return { userId };
};
export const ourFileRouter = {
  productImages: f({ image: { maxFileCount: 10, maxFileSize: "4MB" } })
    .middleware(() => auth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
