'use client';

import React from 'react';
import SearchInput from 'components/fields/SearchInput';
import Pageination from 'components/pageination/Pageination';
import useGet from 'hooks/useGet';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { AssetItemBranch } from 'types/data';

export default function Page() {
  const [query, setQuery] = React.useState('');
  const { id } = useParams();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { data = [] } = useGet<AssetItemBranch>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/asset-item?filters[0][name]=room_id&filters[0][operation]==&filters[0][value]=${id}`,
  );

  // فلترة حسب الاسم
  const filteredData = data.filter((code) =>
    code?.label.toLowerCase().includes(query.toLowerCase()),
  );

  const itemsPerPage = 6;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(start, start + itemsPerPage);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.replace(`?${params.toString()}`);
  };

  // دالة تصدير البيانات إلى Excel
  const exportToExcel = () => {
    const exportData = filteredData.map((item) => ({
      'رقم الملصق': item.label,
      'اسم الأصل': item.asset.name,
      'الملاحظات': item.asset.note || '-',
      'الحالة': item.status === 'new' ? 'جديد' : item.status,
      'تاريخ الإضافة': item.asset.created_at,
      'الغرفة': item.room.name,
      'الشعبة': item.room.division.name,
      'الجهة': item.room.division.department.entity.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الأصول');
    XLSX.writeFile(workbook, 'assets.xlsx');
  };
const translateStatus = (status:string) => {
  switch(status) {
    case 'new': return 'جديد';
    case 'damaged': return 'متضرر';
    case 'Unsigned': return 'غير موقعة';
    case 'Missing': return 'مفقود ';
    case 'Match': return 'مطابق';
    case 'Unknown': return 'غير معرف  ';

    default: return status;
  }
};



  if (data.length <= 0)
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800">
            <p className="mt-4 text-lg text-gray-600">
              جاري التحميل أو ربما لا يوجد أصول في الغرفة{' '}
            </p>
          </h1>
        </div>
      </div>
    );

  return (
    <div dir="rtl" className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-center text-2xl font-bold text-blue-800">
        جدول العناصر المرتبطة بالأصول
      </h1>

      <div className="flex justify-between mb-4">
        <SearchInput
          plaecholder="ابحث عن طريق الكود"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={exportToExcel}
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
        >
          تصدير Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
        <table className="min-w-full bg-white dark:bg-navy-800 text-right text-sm">
          <thead className="bg-blue-600 dark:bg-navy-800 text-sm text-white md:text-base">
            <tr>
              <th className="px-4 py-3">رقم الملصق</th>
              <th className="px-4 py-3">الأصل</th>
              <th className="px-4 py-3">الملاحظات</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">تاريخ الإضافة</th>
              <th className="px-4 py-3">الغرفة</th>
              <th className="px-4 py-3">الشعبة</th>
              <th className="px-4 py-3">الجهة</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((item) => (
              <tr key={item.id} className="dark:text-white">
                <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-200">
                  {item.label}
                </td>
                <td className="flex items-center gap-2 px-4 py-3">
                  <img
                    src={item.asset.image}
                    alt={item.asset.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <span className="text-sm font-semibold">{item.asset.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.asset.note || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      item.status === 'new'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                  {translateStatus(item?.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{item.asset.created_at}</td>
                <td className="px-4 py-3">{item.room.name}</td>
                <td className="px-4 py-3">{item.room.division.name}</td>
                <td className="px-4 py-3">{item.room.division.department.entity.name}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>مجموع الأصول</td>
              <td>{data?.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Pageination totalPages={totalPages} currentPage={currentPage} goToPage={goToPage} />
    </div>
  );
}
