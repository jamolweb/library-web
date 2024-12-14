import DashboardLayout from "../components/DashboardLayout";

export default function Layout({ children }) {
  return (
    <DashboardLayout>
      <main>{children}</main>
    </DashboardLayout>
  );
}
