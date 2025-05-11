import { authSession } from "@/lib/auth-session";

export default async function Home() {
  const session = await authSession();
  return (
    <div>
      <p>{session?.user.role}</p>
    </div>
  );
}
