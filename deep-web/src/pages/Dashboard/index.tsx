import { ModelScore } from "@/pages/Dashboard/components/ModelScore";
import { ModelTraffic } from "@/pages/Dashboard/components/ModelTraffic";

const Dashboard = () => {
  return (
    <div className="h-screen bg-primary-gradient">
      <div className="flex h-full flex-wrap gap-4 p-8">
        <ModelScore />
        <ModelTraffic />
      </div>
    </div>
  );
};

export default Dashboard;
