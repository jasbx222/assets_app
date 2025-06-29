'use client';

import { handleExportReportDetail } from 'hooks/useExportReportDetail';
import useShow from 'hooks/useShow';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Clients, Result, Room, TableAsset } from './components';
import { ItemDetail ,Report} from 'types/data';


export default function ReportDetail() {

  const { id } = useParams();
  const { data: report } = useShow<Report>(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`, id);

  const [filteredItems, setFilteredItems] = useState<ItemDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    if (!report?.result?.items_details) return;

    let items = report.result.items_details;

    if (selectedDivision) {
      items = items.filter((item) => item.division?.name === selectedDivision);
    }

    if (selectedDepartment) {
      items = items.filter((item) => item.department?.name === selectedDepartment);
    }

    if (searchTerm.trim()) {
      items = items.filter((item) =>
        item.label?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(items);
    setCurrentPage(1);
  }, [report, selectedDivision, selectedDepartment, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (!report) {
    return <p className="p-6 text-center text-gray-500">لا توجد بيانات لعرضها</p>;
  }

  const client_id = report.client;
  const room_id = report.room;
  const result = report.result?.stats;

  return (
    <div dir="rtl" className="rtl mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:text-gray-200">
      <h2 className="mb-4 text-xl font-bold">تفاصيل التقرير #{id}</h2>

      <Clients client_id={client_id} />
      <Room room_id={room_id} />
      <Result result={report.result} />

      <section className="mb-4 flex flex-wrap items-center justify-end gap-4">
        <input
          type="search"
          placeholder="ابحث عن طريق الكود"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="rounded-lg border p-2"
        />
      <button
  onClick={() => handleExportReportDetail(filteredItems, id, client_id, room_id, result)}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
>
  تصدير Excel
</button>

      </section>

      <TableAsset
        currentItems={currentItems}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
