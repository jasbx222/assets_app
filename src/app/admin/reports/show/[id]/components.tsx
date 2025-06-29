'use client';
import React from 'react';

//  معلومات الموظف
export const Clients = ({ client_id }: any) => (
  <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <h3 className="mb-4 text-xl font-bold text-blue-600 dark:text-blue-400 border-b pb-2">معلومات الموظف</h3>
    <ul className="space-y-2 text-gray-700 dark:text-gray-200">
      <li><strong>الاسم:</strong> {client_id?.name || '-'}</li>
      <li><strong>الهاتف:</strong> {client_id?.phone || '-'}</li>
      <li><strong>الجهة:</strong> {client_id?.entity?.name || '-'}</li>
      <li><strong>الشعبة:</strong> {client_id?.division?.name || '-'}</li>
      <li><strong>القسم:</strong> {client_id?.division?.department?.name || '-'}</li>
    </ul>
  </section>
);

// معلومات الغرفة
export const Room = ({ room_id }: any) => (
  <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <h3 className="mb-4 text-xl font-bold text-green-600 dark:text-green-400 border-b pb-2">معلومات الغرفة</h3>
    <ul className="space-y-2 text-gray-700 dark:text-gray-200">
      <li><strong>اسم الغرفة:</strong> {room_id?.name || '-'}</li>
      <li><strong>الشعبة:</strong> {room_id?.division?.name || '-'}</li>
      <li><strong>القسم:</strong> {room_id?.division?.department?.name || '-'}</li>
      <li><strong>عدد العناصر:</strong> {room_id?.asset_items_count ?? '-'}</li>
    </ul>
  </section>
);

// إحصائيات التقرير
export const Result = ({ result }: any) => {
  const stats = result?.stats ?? {};

  const statItems = [
    { label: 'عدد الأصول', value: stats.labels_count, bgColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    { label: 'جديدة', value: stats.new_count, bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { label: 'موجودة', value: stats.found_count, bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    { label: 'تالفة', value: stats.damaged_count, bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    { label: 'غير معروفة', value: stats.unknown_count, bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    { label: 'في غرفة أخرى', value: stats.other_room_count, bgColor: 'bg-gray-400 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  ];

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-xl font-bold text-purple-600 dark:text-purple-400 border-b pb-2">إحصائيات التقرير</h3>
      <div className="grid grid-cols-2 gap-4">
        {statItems.map(({ label, value, bgColor }) => (
          <div key={label} className={`rounded-md p-3 font-semibold ${bgColor} flex justify-between`}>
            <span>{label}</span>
            <strong>{value ?? '-'}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

// ترجمة الحالات
const translateStatus = (status: string) => {
  switch (status) {
    case 'new':
      return 'جديدة';
    case 'found':
      return 'موجودة';
    case 'damaged':
      return 'تالفة';
    case 'unknown':
      return 'غير معروفة';
    case 'other_room':
      return 'في غرفة أخرى';
    default:
      return status || '-';
  }
};

export const TableAsset = ({
  currentItems,
  handlePrev,
  handleNext,
  currentPage,
  totalPages
}: any) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 text-xl font-bold text-blue-700 dark:text-blue-400 border-b pb-2">تفاصيل العناصر</h3>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm text-right text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3">رقم الملصق</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">اسم الأصل</th>
              <th className="px-4 py-3">في الغرفة المطلوبة</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? (
              currentItems.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-2">{item.label}</td>
                  <td className="px-4 py-2">{translateStatus(item.status)}</td>
                  <td className="px-4 py-2">{item.asset_name || '-'}</td>
                  <td className="px-4 py-2">{item.in_requested_room ? 'نعم' : 'لا'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                  لا توجد عناصر لعرضها
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`w-full rounded-lg px-4 py-2 font-semibold transition ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          السابق
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`w-full rounded-lg px-4 py-2 font-semibold transition ${
            currentPage === totalPages || totalPages === 0
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          التالي
        </button>
      </div>
    </section>
  );
};
