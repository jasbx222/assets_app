'use client';

import Card from 'components/card';
import useGet from 'hooks/useGet';
import { Client, DepartmentItems, Entity } from 'types/data';
import ProgressItems from './ProgressItems';

const Banner = () => {
  const { data: empolyee = [] } = useGet<Client>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/clients`
  );
  const { data: departments = [] } = useGet<DepartmentItems>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/departments`
  );
  const { data: entities = [] } = useGet<Entity>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/entities`
  );

  return (
    <Card extra="items-center w-full h-full p-[16px] bg-cover">
  
      <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" />

 
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          صفحة الادمن
        </h4>
        <h5 className="text-base font-normal text-gray-600">admin Manager</h5>
      </div>

      <div className="mb-3 mt-6 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            {departments?.length}
          </h4>
          <p className="text-sm font-normal text-gray-600">عدد الاقسام</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            {empolyee?.length}
          </h4>
          <p className="text-sm font-normal text-gray-600">عدد الموظفين</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            {entities?.length}
          </h4>
          <p className="text-sm font-normal text-gray-600">عدد الهيئات</p>
        </div>
      </div>

      <ProgressItems />
    </Card>
  );
};

export default Banner;
