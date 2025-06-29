'use client';
import { useState, useMemo } from 'react';
import { Empolyee } from 'types/data';
import { BsEye, BsPen } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import useDelete from 'hooks/useDelete';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Formbile = ({ items = [], refetch }: { items: Empolyee[], refetch: () => void }) => {
  const route = useRouter();
  const [slice, setSlice] = useState(10);
  const { remove } = useDelete();

  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  const handleDelete = (id: string) => {
    remove(`${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}`);
    refetch();
  };

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchName.toLowerCase()) &&
        item.phone.includes(searchPhone)
    );
  }, [items, searchName, searchPhone]);

  if (!items || items.length === 0) {
    return <p className="py-4 text-center text-gray-500">لا يوجد موظفين حالياً</p>;
  }

  return (
    <div className="w-full md:hidden ">
 
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
        <input
          type="text"
          placeholder="ابحث بالاسم"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-right placeholder:text-gray-400 dark:border-navy-600 dark:bg-navy-800 dark:text-white md:w-48"
        />
        <input
          type="text"
          placeholder="ابحث برقم الهاتف"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-right placeholder:text-gray-400 dark:border-navy-600 dark:bg-navy-800 dark:text-white md:ml-2 md:w-48"
        />
      </div>

      <div className="grid gap-4 md:hidden">
        {filteredItems.slice(0, slice).map((item) => (
          <div
            key={item.id}
            className={`rounded-xl dark:bg-navy-800 dark:text-white  border p-4 shadow-sm `}
          >
            <div className="mb-2 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">{item.name}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {item.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <p className="text-sm text-gray-600"> {item.phone}</p>
            <p className="text-sm text-gray-600"> {item.expiry_date}</p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <FiDelete className="text-lg" />
              </button>
              <Link href={`/admin/empolyee/update/${item.id}`}>
                <BsPen className="text-gray-500 hover:text-blue-500 text-lg" />
              </Link>
              <Link href={`/admin/empolyee/show/${item.id}`}>
                <BsEye className="text-gray-500 hover:text-green-500 text-lg" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setSlice(slice - 10)}
            disabled={slice <= 10}
            className="rounded-md bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            السابق
          </button>
          <span className="text-sm text-gray-600">
            عرض {Math.min(slice, filteredItems.length)} من {filteredItems.length}
          </span>
          <button
            onClick={() => setSlice(slice + 10)}
            disabled={slice >= filteredItems.length}
            className="rounded-md bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default Formbile;
