"use client";
import { createContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaCalendar,
  FaChartBar,
  FaClipboardList,
  FaBook,
  FaUpload,
  FaCogs,
  FaChalkboardTeacher,
  FaImages,
  FaAddressBook,
  FaShoppingCart,
  FaCashRegister,
  FaMoneyCheck,
  FaCode,
  FaCaretSquareLeft,
} from "react-icons/fa";
import Header from "./Header";
import Loading from "./loader";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export const LoginContext = createContext({});

const TeacherLayout = ({ children }) => {
  const [mySession, setMySession] = useState(null);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setMySession(session);
      setLoading(false);
    };
    fetchSession();
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  const Menus = [
    // Tuckshop Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/tuckshop",
      roles: ["tuckshop"],
    },
    {
      title: "Add Inventory",
      src: "FaShoppingCart",
      DashboardLink: "/dashboard/tuckshop/inventory",
      roles: ["tuckshop"],
    },

    // Canteen Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/canteen",
      roles: ["canteen"],
    },
    // {
    //   title: "Manage Orders",
    //   src: "FaClipboardList",
    //   DashboardLink: "/dashboard/canteen/manageOrders",
    //   roles: ["canteen"],
    // },
    {
      title: "Inventory",
      src: "FaShoppingCart",
      DashboardLink: "/dashboard/canteen/inventory",
      roles: ["canteen"],
    },

    // Student Menus
    {
      title: "Order",
      src: "FaHome",
      DashboardLink: "/dashboard/student",
      roles: ["student"],
    },
    // {
    //   title: "Order Food",
    //   src: "FaShoppingCart",
    //   DashboardLink: "/dashboard/student/order",
    //   roles: ["student"],
    // },

    {
      title: "Transaction History",
      src: "FaCashRegister",
      DashboardLink: "/dashboard/student/transactions",
      roles: ["student"],
    },
    // bank account
    {
      title: "Bank Account",
      src: "FaMoneyCheck",
      DashboardLink: "/dashboard/student/studentAccounts",
      roles: ["student"],
    },

    // Admin Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/admin",
      roles: ["admin"],
    },
    {
      title: "Manage Orders",
      src: "FaClipboardList",
      DashboardLink: "/dashboard/admin/manageOrders",
      roles: ["admin"],
    },
    {
      title: "Fund Students",
      src: "FaMoneyCheck",
      DashboardLink: "/dashboard/admin/studentAccounts",
      roles: ["admin"],
    },
    {
      title: "Manage Users",
      src: "FaUser",
      DashboardLink: "/dashboard/admin/manageUsers",
      roles: ["admin"],
    },
    // IT Support Menus
    {
      title: "Home",
      src: "FaHome",
      DashboardLink: "/dashboard/it-support",
      roles: ["it-support"],
    },
    {
      title: "System Logs",
      src: "FaCode",
      DashboardLink: "/dashboard/it-support/logs",
      roles: ["it-support"],
    },
    {
      title: "Technical Issues",
      src: "FaCogs",
      DashboardLink: "/dashboard/it-support/issues",
      roles: ["it-support"],
    },
  ];

  const iconMapping = {
    FaHome: <FaHome />,
    FaUser: <FaUser />,
    FaCalendar: <FaCalendar />,
    FaChartBar: <FaChartBar />,
    FaClipboardList: <FaClipboardList />,
    FaBook: <FaBook />,
    FaUpload: <FaUpload />,
    FaCogs: <FaCogs />,
    FaChalkboardTeacher: <FaChalkboardTeacher />,
    FaImages: <FaImages />,
    FaAddressBook: <FaAddressBook />,
    FaShoppingCart: <FaShoppingCart />,
    FaCashRegister: <FaCashRegister />,
    FaMoneyCheck: <FaMoneyCheck />,
    FaCode: <FaCode />,
  };

  const filteredMenus = Menus.filter(
    (menu) => !menu.roles || menu.roles.includes(mySession?.user.role)
  );

  return (
    <div
      className={`flex bg-slate-50 dark:bg-gradient-to-tr dark:from-slate-950 from-10% dark:via-slate-900 via-80% dark:to-slate-950 to-90%`}
    >
      {filteredMenus.length > 0 ? (
        <div className="flex w-full">
          <div
            className={`${open ? "w-72" : "w-20"
              } visuals min-h-screen p-5 pt-8 relative duration-300 border-none dark:bg-transparent shadow-slate-700 shadow-2xl hidden md:block`}
          >
            <div
              className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full text-red-800 ${!open && "rotate-180"
                }`}
              onClick={() => setOpen(!open)}
            >
              <FaCaretSquareLeft />
            </div>
            <div className="flex gap-x-4 items-center ">
              <img
                src="/assets/logo.png"
                height={100}
                width={100}
                className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
                  }`}
              />
              <h1
                className={`text-red-800 dark:text-red-100 origin-left text-xl duration-200 tracking-widest font-light ${!open && "scale-0"
                  }`}
              >
                Riverside <br />
                <span className="text-rose-700">School</span>
              </h1>
            </div>
            <ul className="pt-10 ">
              {filteredMenus.map((menu, index) => (
                <Link href={menu.DashboardLink} key={index}>
                  <li
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-red-600 hover:text-red-50 transition-all duration-300 text-red-800 dark:text-slate-100 text-sm items-center gap-x-4 mt-2 ${index === 0 && "bg-light-white"
                      }`}
                  >
                    <div className="w-5 h-5">{iconMapping[menu.src]}</div>
                    <span
                      className={`${!open && "hidden"
                        } origin-left duration-200 text-inherit`}
                    >
                      {menu.title}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="min-h-screen w-full px-0 sm:px-8 py-20 flex flex-col items-center  md:space-y-7">
            {mySession && (
              <Header
                name={mySession.user.firstname}
                lastname={mySession.user.lastname}
                role={mySession.user.role}
                image={mySession.user.profileUrl}
                students={mySession.user.students}
              />
            )}
            {children}

          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full">
          <LoginContext.Provider value={login}>
            {children}
          </LoginContext.Provider>
        </div>
      )}
    </div>
  );
};

export default TeacherLayout; 