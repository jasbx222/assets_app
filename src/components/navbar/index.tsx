'use client';
import { useState, useEffect } from 'react';
import Dropdown from 'components/dropdown';
import { FiAlignJustify } from 'react-icons/fi';
import NavLink from 'components/link/NavLink';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import useGetnotific from 'hooks/useGetNotifcations';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Navbar = (props: { onOpenSidenav: () => void; brandText: string; secondary?: boolean | string; [x: string]: any; }) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = useState(typeof window !== 'undefined' && document.body.classList.contains('dark'));
  const [slice, setSlice] = useState(3);
  const [popupVisible, setPopupVisible] = useState(false);
  const [lastNotifId, setLastNotifId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const navigate = useRouter();

  type NotificationItem = {
    id: string;
    notification: { title: string; body: string; report_id: number; };
    created_at: string;
    read_at: string | null;
  };

  function formatArabicDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { month: 'long', hour: 'numeric', day: 'numeric' });
  }

  const { data } = useGetnotific<NotificationItem>(`${process.env.NEXT_PUBLIC_BASE_URL}/notification`);
  const { data: filterData } = useGetnotific<NotificationItem>(`${process.env.NEXT_PUBLIC_BASE_URL}/notification`);

  const filter = filterData
    .filter((item) => formatArabicDate(item.created_at).toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .filter((item) => !clearedIds.includes(item.id));

  useEffect(() => {
    if (data && data.length > 0) {
      const newest = data[0];
      const lastSeenId = localStorage.getItem('lastSeenNotificationId');
      if (newest.id !== lastSeenId) {
        setLastNotifId(newest.id);
        setPopupVisible(true);
        localStorage.setItem('lastSeenNotificationId', newest.id);
        setTimeout(() => setPopupVisible(false), 4000);
      }
    }
  }, [data]);

  const handleLogout = () => {
    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }).then(() => {
      localStorage.clear();
      navigate.push('/login');
    }).catch(console.log);
  };

  const handleSliceChange = (newSlice: number) => setSlice(newSlice);

  const handleClearNotification = (id: string) => {
    setClearedIds((prev) => [...prev, id]);
  };

  return (
    <>
      <AnimatePresence>
        {popupVisible && data && data[0] && (
          <Link href={`/admin/reports/show/${data[0].notification.report_id}`}>
            <div className="flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                className="fixed top-5 z-[9999] md:right-24 right-5 w-[320px] rounded-xl bg-white border-r-4 border-red-500 p-4 shadow-lg dark:bg-navy-800 dark:text-white"
                dir="rtl"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-base font-bold text-red-600">{data[0].notification.title}</p>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data[0].notification.body}</span>
                </div>
              </motion.div>
            </div>
          </Link>
        )}
      </AnimatePresence>

      <nav dir="rtl" className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
        <div className="mr-[6px]">
          <div className="h-6 w-[224px] pt-1">
            <a className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white" href=" ">الصفحات <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white"> / </span></a>
            <NavLink className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white" href="#">{brandText}</NavLink>
          </div>
          <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
            <NavLink href="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">{brandText}</NavLink>
          </p>
        </div>

        <div className="relative mt-[3px] flex h-[61px] w-full flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl dark:!bg-navy-800 md:w-[365px] md:flex-grow-0 xl:w-[365px]">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Dropdown
              button={
                <div className="flex  cursor-pointer w-full items-center justify-between gap-2 rounded-full px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-navy-800">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {data?.length ?? 0} إشعارات
                    </span>
                  </div>
                </div>
              }
              classNames="py-2 top-10 right-0 w-[300px] z-50"
            >
              <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-md dark:bg-navy-700" dir="rtl">
                <div className="relative w-full max-w-sm">
                  <input
                    type="search"
                    onChange={(e: any) => setQuery(e.target.value)}
                    value={query}
                    placeholder="ابحث عن طريق تاريخ الجرد"
                    className="w-full dark:bg-navy-800 dark:text-white/80 pl-12 pr-4 py-3 rounded-2xl bg-white/90 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                  <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1117 9a7.5 7.5 0 01-.35 7.65z" />
                  </svg>
                </div>

                {filter.slice(slice - 3, slice).map((notification) => (
                  <div key={notification.id} className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:bg-gray-100 dark:border-navy-600 dark:bg-navy-600 dark:hover:bg-navy-500">
                    <Link href={`/admin/reports/show/${notification.notification.report_id}`}>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{notification.notification.title}</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{notification.notification.body}</p>
                    </Link>
                    <span className="text-xs text-gray-800 dark:text-gray-300">{formatArabicDate(notification.created_at)}</span>
                    <button
                      onClick={() => handleClearNotification(notification.id)}
                      className="self-start mt-1 text-xs text-red-600 hover:underline dark:text-red-400"
                    >
                      مسح
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <button onClick={() => handleSliceChange(slice - 3)} disabled={slice <= 4} className="rounded-md bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50">السابق</button>
                  <span className="text-sm text-gray-600">عرض {slice} من {data?.length}</span>
                  <button onClick={() => handleSliceChange(slice + 3)} disabled={slice >= (data?.length ?? 0)} className="rounded-md bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50">التالي</button>
                </div>
              </div>
            </Dropdown>
          </div>

          <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={onOpenSidenav}>
            <FiAlignJustify className="h-5 w-5" />
          </span>

          <div className="cursor-pointer text-gray-600" onClick={() => {
            document.body.classList.toggle('dark');
            setDarkmode(!darkmode);
          }}>
            {darkmode ? <RiSunFill className="h-4 w-4" /> : <RiMoonFill className="h-4 w-4" />}
          </div>

          <Dropdown button={<FaUser className='dark:text-white' />} classNames={'py-2 top-8  -right-[180px] w-max'}>
            <div className="flex fixed text-center h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl dark:bg-navy-700 dark:text-white">
              <div className="mt-3  h-px w-full bg-gray-200 dark:bg-white/20" />
              <div className=" mt-3 grid grid-cols-1 gap-5 items-end">
                <Link href={'/admin/profile'}>
                  <button className="mt-3 text-sm text-center font-medium text-red-500 hover:text-red-500">إعدادات الحساب</button>
                </Link>
                <button onClick={handleLogout} className="mt-3 text-sm text-center font-medium text-red-500 hover:text-red-500">تسجيل الخروج</button>
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
