import { ItemDetail } from "types/data";
import * as XLSX from 'xlsx';

const translateStatus = (status: string) => {
  switch (status) {
    case 'new': return 'جديدة';
    case 'found': return 'موجودة';
    case 'damaged': return 'تالفة';
    case 'unknown': return 'غير معروفة';
    case 'other_room': return 'في غرفة أخرى';
    default: return status || '-';
  }
};
export function handleExportReportDetail(
  filteredItems: ItemDetail[] = [],
  id: any,
  client: any,
  room: any,
  stats: any
) {
  console.log('filteredItems', filteredItems);
  console.log('client', client);
  console.log('room', room);
  console.log('stats', stats);

  const data: any[][] = [];

  // بيانات الموظف
  data.push(['معلومات الموظف']);
  data.push(['الاسم', client?.name || '-']);
  data.push(['الهاتف', client?.phone || '-']);
  data.push(['الجهة', client?.entity?.name || '-']);
  data.push(['الشعبة', client?.division?.name || '-']);
  data.push(['القسم', client?.division?.department?.name || '-']);
  data.push([]);

  // بيانات الغرفة
  data.push(['معلومات الغرفة']);
  data.push(['اسم الغرفة', room?.name || '-']);
  data.push(['الشعبة', room?.division?.name || '-']);
  data.push(['القسم', room?.division?.department?.name || '-']);
  data.push(['عدد العناصر', room?.asset_items_count ?? '-']);
  data.push([]);

  // إحصائيات التقرير
  data.push(['إحصائيات التقرير']);
  data.push(['عدد الأصول', stats?.labels_count ?? '-']);
  data.push(['جديدة', stats?.new_count ?? '-']);
  data.push(['موجودة', stats?.found_count ?? '-']);
  data.push(['تالفة', stats?.damaged_count ?? '-']);
  data.push(['غير معروفة', stats?.unknown_count ?? '-']);
  data.push(['في غرفة أخرى', stats?.other_room_count ?? '-']);
  data.push([]);

  // عنوان الجدول
  data.push(['رقم الملصق', 'الحالة', 'اسم الأصل', 'في الغرفة المطلوبة']);

  if (!filteredItems.length) {
    // لو ما في عناصر، اضف صف واحد فقط يوضح عدم وجود بيانات
    data.push(['-', '-', 'لا توجد بيانات', '-']);
  } else {
    filteredItems.forEach((item: ItemDetail) => {
      data.push([
        item.label || '-',
        translateStatus(item.status),
        item.asset_name || '-',
        item.in_requested_room ? 'نعم' : 'لا',
      ]);
    });
  }

  // انشئ ورقة العمل
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'تقرير');

  // احفظ الملف
  XLSX.writeFile(wb, `تقرير-${id}.xlsx`);
}
