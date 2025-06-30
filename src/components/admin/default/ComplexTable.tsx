'use client';
import React, { useState } from 'react';
import Card from 'components/card';
import { MdCancel, MdCheckCircle, MdOutlineError } from 'react-icons/md';
import Pageination from 'components/pageination/Pageination';
import * as XLSX from 'xlsx';
import { AssetItem } from 'types/data';

type Props = {
  tableData: AssetItem[];
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
  items_length: any;
};

const AssetTable = ({
  tableData,
  totalPages,
  currentPage,
  goToPage,
  items_length,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const exportToExcel = () => {
    const worksheetData = tableData.map((row) => ({
      'اسم الأصل': row.asset.name,
      الحالة: row.status,
      التاريخ: row.asset.created_at,
      الليبل: row.label,
      الغرفة: row.room.name,
      الشعبة: row.room.division.name,
      القسم: row.room.division.department.name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الأصول');
    XLSX.writeFile(workbook, 'filtered_assets.xlsx');
  };

  const filter = tableData.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card extra="w-full container    px-2 sm:px-4 pb-6   relative top-12  " >
      {/* البحث والتصدير */}
      <div className="flex flex-col md:flex-row  justify-between gap-4 mb-6">
        <input
          type="search"
          placeholder="ابحث عن طريق الكود"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full dark:text-gray-700 md:w-1/3 rounded-lg border p-2 text-sm"
        />

        <button
          onClick={exportToExcel}
          className="w-full md:w-auto rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          تصدير Excel
        </button>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto" dir="rtl">
        <table className="w-full min-w-[700px] text-right text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">اسم الأصل</th>
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">الحالة</th>
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">التاريخ</th>
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">الليبل</th>
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">الغرفة</th>
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">الشعبة</th>
              <th className="px-3 py-2 font-bold text-gray-700 dark:text-white">القسم</th>
            </tr>
          </thead>
          <tbody>
            {filter.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-3 py-2">{row.asset.name}</td>
                <td className="flex items-center gap-2 px-3 py-2">
                  {row.status === 'new' && <MdCheckCircle className="text-green-500" />}
                  {row.status === 'damaged' && <MdCancel className="text-red-500" />}
                  {row.status === 'مستعمل' && <MdOutlineError className="text-yellow-500" />}
                  <span>{row.status}</span>
                </td>
                <td className="px-3 py-2">{row.asset.created_at}</td>
                <td className="px-3 py-2">{row.label}</td>
                <td className="px-3 py-2">{row.room.name}</td>
                <td className="px-3 py-2">{row.room.division.name}</td>
                <td className="px-3 py-2">{row.room.division.department.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* الباجينيشن */}
      <div className="mt-6">
        <Pageination
          totalPages={totalPages}
          goToPage={goToPage}
          currentPage={currentPage}
        />
      </div>
    </Card>
  );
};

export default AssetTable;
