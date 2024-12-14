import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Book", path: "/dashboard/create-book" },
    { name: "Create Student", path: "/dashboard/create-student" },
    { name: "Manage Books", path: "/dashboard/books" },
    { name: "Manage Students", path: "/dashboard/students" },
    { name: "Manage Borrowings", path: "/dashboard/borrowings" },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white">
      <div className="p-4 text-xl font-bold">Library Admin</div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <span
              className={`block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-gray-700 hover:text-white
                ${
                  router.pathname === item.path
                    ? "bg-gray-700"
                    : "text-gray-400"
                }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
