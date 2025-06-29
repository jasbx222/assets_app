'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { handleExport } from 'hooks/useExportToEx';
import TableReports from './TableReports';
import useGet from 'hooks/useGet';

interface Entity {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  entity: Entity;
  created_at: string;
}

interface Division {
  id: number;
  name: string;
  department: Department;
  assets_count?: number;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  is_active?: boolean;
  expiry_date?: string;
  created_at: string;
  entity: Entity;
  departmen?: any | null;
  division: Division;
}

interface ReportItem {
  id: number;
  client: Client;
  created_at: string;

}

export default function Page() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const reportsPerPage = 6;
  const router = useRouter();

  const { data } = useGet<ReportItem>(`${process.env.NEXT_PUBLIC_BASE_URL}/reports`);

  const parseDate = (dateString: string): Date | null => {
    const datePart = dateString?.split('|')[0]?.trim();
    const parsed = new Date(datePart);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = data;

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      result = result.filter((item) => {
        const createdAt = parseDate(item.created_at);
        if (!createdAt) return false;
        return createdAt >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      result = result.filter((item) => {
        const createdAt = parseDate(item?.created_at);
        if (!createdAt) return false;
        return createdAt <= toDate;
      });
    }

    if (selectedDepartment) {
      result = result.filter(
        (item) => item.client?.division?.department?.name === selectedDepartment
      );
    }

    return result;
  }, [data, dateFrom, dateTo, selectedDepartment]);

  const totalPages = Math.ceil(filteredData.length / reportsPerPage);
  const start = (currentPage - 1) * reportsPerPage;
  const currentReports = filteredData.slice(start, start + reportsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewDetails = (id: number) => {
    router.push(`/admin/reports/show/${id}`);
  };

  const departments: string[] = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(
        data
          .map((item) => item.client?.division?.department?.name)
          .filter((name): name is string => Boolean(name))
      )
    );
  }, [data]);

  return (
    <div className="rtl min-h-screen space-y-6 bg-gray-50 p-6 dark:bg-gray-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">التقارير</h1>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="dateFrom" className="dark:text-white text-gray-800">من</label>
          <input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
            className="rounded-lg border p-2"
          />
          <label htmlFor="dateTo" className="dark:text-white text-gray-800">الى</label>
          <input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
            className="rounded-lg border p-2"
          />
          <select
            value={selectedDepartment}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border p-2"
          >
            <option value="">كل الأقسام</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleExport(filteredData)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
          >
            تصدير Excel
          </button>
        </div>
      </div>

      <TableReports currentReports={currentReports} handleViewDetails={handleViewDetails} />

      <div className="mt-6 flex justify-center space-x-2" dir="rtl">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`h-8 w-8 rounded-full text-sm font-semibold ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
