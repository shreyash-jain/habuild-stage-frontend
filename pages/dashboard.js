import LayoutSidebar from "../components/LayoutSidebar";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
    </div>
  );
};

Dashboard.getLayout = LayoutSidebar;

export default Dashboard;
