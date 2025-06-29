'use client';
import React, { useEffect, useState } from 'react';
import useGet from 'hooks/useGet';
import Link from 'next/link';

type Client = {
  id: number;
  name: string;
  phone: string;
  is_active: boolean;
  expiry_date: string;
  created_at: string;
  entity: { id: number; name: string };
  division: {
    id: number;
    name: string;
    department: { id: number; name: string; entity: any; created_at: string };
    assets_count: number;
    created_at: string;
  };
};

type Report = {
  id: number;
  client: Client;
  created_at: string;
};

export default function LastReport() {
  const { data: reports = [] } = useGet<Report>(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`);
  const [lastReport, setLastReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!reports.length) return;
    const sortedReports = [...reports].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setLastReport(sortedReports[0]);
  }, [reports]);

  if (!lastReport) return <p className="p-6 text-center text-gray-500">لا توجد عمليات جرد</p>;

  return (
<Link href={`/admin/reports/show/${lastReport.id}`}>
    <div
      dir="rtl"
      className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl
                 border border-gray-300 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">آخر عملية جرد</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="font-semibold mb-2">رقم التقرير:</h3>
          <p className="text-lg">{lastReport.id}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">تاريخ الجرد:</h3>
          <p className="text-lg">{lastReport.created_at}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">اسم الموظف:</h3>
          <p className="text-lg">{lastReport.client.name}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">هاتف الموظف:</h3>
          <p className="text-lg">{lastReport.client.phone}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">الجهة:</h3>
          <p className="text-lg">{lastReport.client.entity.name}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">الشعبة:</h3>
          <p className="text-lg">{lastReport.client.division.name}</p>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold mb-2">القسم:</h3>
          <p className="text-lg">{lastReport.client.division.department.name}</p>
        </div>
      </div>
    </div></Link>
  );
}
