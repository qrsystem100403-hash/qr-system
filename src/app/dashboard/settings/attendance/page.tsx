import { requireOwnerUser } from "@/lib/requireRestaurantUser";
import AttendanceSettingsPage from "./AttendanceSettingsPage";
import DashboardPageHeader from "@/app/components/dashboard/ui/DashboardPageHeader";
export default async function Page() {
  await requireOwnerUser();

  return(

<>

<DashboardPageHeader
  title="Attendance Settings"
  description="Configure GPS attendance policies and restaurant location."
/>

<AttendanceSettingsPage />
</>
      
  ) 
}