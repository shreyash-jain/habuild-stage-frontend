import LayoutSidebar from "../components/LayoutSidebar";
import useCheckAuth from "../hooks/useCheckAuth";
import { RefreshIcon } from "@heroicons/react/outline";
import { useFetchWrapper } from "../utils/apiCall";

const LeadAnalytics = () => {
  const { checkAuthLoading } = useFetchWrapper();

  if (checkAuthLoading) {
    return <RefreshIcon className="text-green-300 h-8 w-8 mx-auto" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Lead Analytics</h1>
    </div>
  );
};

LeadAnalytics.getLayout = LayoutSidebar;

export default LeadAnalytics;
