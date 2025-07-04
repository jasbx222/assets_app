'use client';
import Chart from 'components/admin/default/WeeklyRevenue';
import TotalSpent from 'components/admin/default/TotalSpent';
import { IoMdHome } from 'react-icons/io';
import { MdBarChart } from 'react-icons/md';
import Widget from 'components/widget/Widget';

import useGet from 'hooks/useGet';
import useGetProfile from 'hooks/useGetProfile';
import { FaBell, FaUser } from 'react-icons/fa';
import { Asset, Client, DepartmentItems, Entity, LastReportType, NotificationItem } from 'types/data';
import LastReport from './LastReport';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';


interface AssetItem{
     total:number
}
const Dashboard = () => {
  const { data: tableDataComplex } = useGetProfile<AssetItem>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/asset-item`,
  );
  const { data: empolyee = [] } = useGet<Client>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/clients`,
  );
  const { data: notifaction = [] } = useGet<NotificationItem>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/notification`,
  );
  const { data: departments = [] } = useGet<DepartmentItems>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/departments`,
  );
  const { data: entities = [] } = useGet<Entity>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/entities`,
  );
  const { data: report } = useGet<LastReportType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reports`,
  );

const lastAsset = report[report.length - 1];

  return (
    <div  dir='rtl'>
 
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title="اجمالي الاصول"
          subtitle={tableDataComplex?.total ?? 0}
        />

<Widget
  icon={<MdBarChart className="h-6 w-6" />}
  title="اخر الجرد"
  subtitle={
    lastAsset?.created_at
      ? dayjs(lastAsset.created_at.replace(' | ', ' '), 'YYYY-MM-DD h:mm a')
          .locale('ar')
          .format('D MMMM YYYY') 
      : 'لا يوجد تاريخ'
  }
/>




        <Widget
          icon={<FaBell className="h-7 w-7" />}
          title="الاشعارات"
          subtitle={notifaction.length.toString()}
        />
        <Widget
          icon={<FaUser className="h-6 w-6" />}
          title="الموظفين"
          subtitle={empolyee.length.toString()}
        />
        <Widget
          icon={<IoMdHome className="h-7 w-7" />}
          title="الاقسام"
          subtitle={departments.length.toString()}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title="الشعب"
          subtitle={entities.length.toString()}
        />
        
    
      </div>

 
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <Chart />
      </div>

      {/* جدول الأصول */}
    <LastReport/>
    </div>
  );
};

export default Dashboard;
