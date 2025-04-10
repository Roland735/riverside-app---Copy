import { getServerSession } from "next-auth";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession();
  if (session?.user.name && session.user.role) {
    redirect("/dashboard");
  }
  return <Form />;
}
