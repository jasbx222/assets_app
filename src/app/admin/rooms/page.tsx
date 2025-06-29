'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye } from 'lucide-react';

import useGet from 'hooks/useGet';
import Pageination from 'components/pageination/Pageination';
import SearchInput from 'components/fields/SearchInput';
import { RoomsAssets } from 'types/data';

const DivisionCard: React.FC<{ rooms: RoomsAssets }> = ({ rooms }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-navy-800">
     <Link href={`/admin/rooms/show/${rooms?.id}`} className="flex justify-center items-center gap-3">
    
    <div className="space-y-2 text-right">
      <h2 className="text-lg font-bold text-blue-700 dark:text-white/90">{rooms?.name}</h2>
      <p className="text-sm text-gray-700 dark:text-white/90">
        الشعبة: <span className="font-semibold">{rooms?.division?.name ?? 'غير معروف'}</span>
      </p>
      <p className="text-sm text-gray-700 dark:text-white/90">
        القسم: <span className="font-semibold">{rooms?.division?.department?.name ?? 'غير معروف'}</span>
      </p>
      <p className="text-sm text-gray-700 dark:text-white/90">
        الهيئة: <span className="font-semibold">{rooms?.division?.department?.entity?.name ?? 'غير معروف'}</span>
      </p>
      <p className="text-sm text-gray-700 dark:text-white/90">
        عدد الاصول: <span className="font-semibold">{rooms?.asset_items_count ?? 'غير معروف'}</span>
      </p>
    
    </div>
     </Link>
  </div>
);

export default function DivisionsListPage() {
  const { data } = useGet<RoomsAssets>(`${process.env.NEXT_PUBLIC_BASE_URL}/rooms`);
  const [query, setQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data) return null;

  const departments = Array.from(
    new Set(
      data
        .map((room) => room?.division?.department?.name?.trim())
        .filter((name): name is string => !!name)
    )
  );

  const divisions = Array.from(
    new Set(
      data
        .filter((room) =>
          selectedDepartment
            ? room?.division?.department?.name?.trim() === selectedDepartment
            : true
        )
        .map((room) => room?.division?.name?.trim())
        .filter((name): name is string => !!name)
    )
  );

  const filteredData = data.filter((room) => {
    const matchesSearch = room.name?.toLowerCase().includes(query.toLowerCase());
    const matchesDepartment = selectedDepartment
      ? room?.division?.department?.name?.trim() === selectedDepartment
      : true;
    const matchesDivision = selectedDivision
      ? room?.division?.name?.trim() === selectedDivision
      : true;
    return matchesSearch && matchesDepartment && matchesDivision;
  });
const itemsPerPage = 6;
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

let currentPage = parseInt(searchParams.get('page') || '1', 10);
if (totalPages > 0) {
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
} else {
  currentPage = 1;
}

const start = (currentPage - 1) * itemsPerPage;
const currentItems = filteredData.slice(start, start + itemsPerPage);

const goToPage = (page: number) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set('page', page.toString());
  router.replace(`?${params.toString()}`);
};


  return (
    <div dir="rtl" className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-center text-2xl font-bold text-blue-800">الغرف</h1>
 <SearchInput
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          plaecholder="ابحث عن الغرفة..."
        />
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
       

        <select
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setSelectedDivision('');
          }}
        >
          <option value="">كل الأقسام</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          disabled={!selectedDepartment}
        >
          <option value="">كل الشعب</option>
          {divisions.map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>
      </div>

      {currentItems.length === 0 && (
        <p className="text-center text-red-600 font-bold mt-10">لا توجد غرف مطابقة للفلتر.</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((room) => (
          <DivisionCard key={room.id} rooms={room} />
        ))}
      </div>

      <div className="mt-10">
        <Pageination
          totalPages={totalPages}
          currentPage={currentPage}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
}
