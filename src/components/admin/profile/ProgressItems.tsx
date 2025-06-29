'use client';

import Card from "components/card";
import { useEffect, useState } from "react";
import { Rss } from "lucide-react";
import useGet from "hooks/useGet";

const ProgressItems = () => {
  const { data: items = [] } = useGet(process.env.NEXT_PUBLIC_BASE_URL+'/asset-item');

  const [countedCount, setCountedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (items && Array.isArray(items)) {
   
      setCountedCount(items.length);
      setTotalCount(100000);
    }
  }, [items]);

  const progress = totalCount > 0 ? (countedCount / totalCount) * 100 : 0;

  return (
    <Card extra={"w-full h-full p-4"}>
 

      <div className="mb-auto flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[26px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
          <Rss />
        </div>
        <p className="mb-px mt-3 text-2xl font-bold text-navy-700 dark:text-white">
          حالة الجرد
        </p>
      </div>

      <div className="flex flex-col mt-4">
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <p>{countedCount.toLocaleString()} تم جرده</p>
          <p>{totalCount.toLocaleString()} إجمالي العناصر</p>
        </div>

        <div className="mt-2 flex h-3 w-full items-center rounded-full bg-lightPrimary dark:!bg-navy-700">
          <span
            className="h-full rounded-full bg-brand-500 dark:!bg-white transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProgressItems;
