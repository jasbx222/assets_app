'use client';
import SearchInput from 'components/fields/SearchInput';
import Pageination from 'components/pageination/Pageination';
import useGet from 'hooks/useGet';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AssetItemBranch } from 'types/data';

export default function AssetItemsTable() {
  const [query, setQuery] = React.useState('');
  const { id } = useParams();

  const router = useRouter();
  const searchParams = useSearchParams();

  // if (!data) return null;
  const { data } = useGet<AssetItemBranch>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/asset-item?filters[0][name]=asset_id&filters[0][operation]==&filters[0][value]=${id}`,
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
   if (data.length <=0)
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800">
            <p className="mt-4 text-lg text-gray-600">
        لم يتم العثور على بيانات الأصل.
            </p>
          </h1>
        </div>
      </div>
    );
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
  return (
    <div dir="rtl" className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-center text-2xl font-bold text-blue-800">
        جدول العناصر المرتبطة بالأصول
      </h1>
      <SearchInput
        plaecholder="ابحث عن طريق الكود"
        value={query}
        onChange={(e:any) => setQuery(e.target.value)}
      />
     
       <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
        <table className="min-w-full bg-white text-right text-sm">
          <thead className="bg-blue-600 dark:bg-navy-800  dark:text-white text-sm text-white md:text-base">
            <tr>
              <th className="px-4 py-3">الكود</th>
              <th className="px-4 py-3">الأصل</th>
              <th className="px-4 py-3">الملاحظات</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">تاريخ الإضافة</th>
              <th className="px-4 py-3">الغرفة</th>
              <th className="px-4 py-3">الشعبة</th>
              <th className="px-4 py-3">الجهة</th>
            </tr>
          </thead>
          <tbody className='dark:bg-navy-800  dark:text-white'>
            {currentItems?.map((item) => (
              <tr key={item.id} className="">
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {item.label}
                </td>

                <td className="flex items-center gap-2 px-4 py-3">
                  <img
                    src={item.asset.image}
                    alt={item.asset.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <span className="text-sm font-semibold">
                    {item.asset.name}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.asset.note || '—'}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      item.status === 'new'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                  { translateStatus(item.status)}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-gray-500">
                  {item.asset.created_at}
                </td>
                <td className="px-4 py-3">{item.room.name}</td>
                <td className="px-4 py-3">{item.room.division.name}</td>
                <td className="px-4 py-3">
                  {item.room.division.department.entity.name}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>مجموع الاصول</td>
              <td>{data?.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
   

      <Pageination
        totalPages={totalPages}
        currentPage={currentPage}
        goToPage={goToPage}
      />
    </div>
  );
}
