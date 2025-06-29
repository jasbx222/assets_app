'use client';

import ComplexTable from 'components/admin/default/ComplexTable';
import useGet from 'hooks/useGet';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { AssetItem } from 'types/data';

const Page = () => {
  const { data} = useGet<AssetItem>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/asset-item`
  );

  const searchParams = useSearchParams();
  const router = useRouter()
  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = data.slice(start, end);

  const goToPage = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <div className="container w-full space-y-4" dir='rtl'>
    


      <ComplexTable
        tableData={currentItems}
        goToPage={goToPage}
          items_length={data}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Page;
