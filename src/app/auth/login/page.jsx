import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaUserShield, FaUser, FaTools, FaStore } from "react-icons/fa";
import { MdSchool, MdFastfood } from "react-icons/md";

export default async function Login() {
  const session = await getServerSession();
  if (session?.user.name && session.user.role) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900 bg-gray-100 w-full ">
      <div className="text-lg font-bold">
        Welcome to <span className="text-red-500">Riverside Portal</span>
      </div>
      <div className="">Please select your role</div>
      <div className="flex flex-row space-x-4 my-3 ">
        <Link
          href={"student"}
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000 "
        >
          <span className="">Student</span>
          <span className="text-3xl text-red-500">
            <MdSchool />
          </span>
        </Link>
        <Link
          href={"admin"}
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
        >
          <span className="">Admin</span>
          <span className="text-3xl text-red-500">
            <FaUserShield />
          </span>
        </Link>
        <Link
          href={"it-support"}
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
        >
          <span className="">IT Support</span>
          <span className="text-3xl text-red-500">
            <FaTools />
          </span>
        </Link>
        <Link
          href={"canteen"}
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
        >
          <span className="">Canteen</span>
          <span className="text-3xl text-red-500">
            <MdFastfood />
          </span>
        </Link>
        <Link
          href={"tuckshop"}
          className="flex flex-col items-center justify-center border-2 border-red-500 rounded-md px-4 py-2 hover:bg-red-300 transition-colors duration-1000"
        >
          <span className="">TuckShop</span>
          <span className="text-3xl text-red-500">
            <FaStore />
          </span>
        </Link>
      </div>
    </div>
  );
}
