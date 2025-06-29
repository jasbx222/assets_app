'use client';

import React, { useState } from 'react';
import AssetsTable from 'components/admin/data-assets/AssetsTable';
import AddNewEssets from './add/AddNewEssets';
import useGet from 'hooks/useGet';
import { useRouter, useSearchParams } from 'next/navigation';

const Tables = () => {
  const router = useRouter();
  const [showAddNewAssets, setShowAddNewAssets] = useState(false);

  const searchParams = useSearchParams();

  
  const departmentFilter = searchParams.get('departments') || '';
  const roomFilter = searchParams.get('room') || '';
  const groupFilter = searchParams.get('group') || '';

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const queryString = new URLSearchParams();
  if (departmentFilter) queryString.append('department', departmentFilter);
  if (roomFilter) queryString.append('room', roomFilter);
  if (groupFilter) queryString.append('group', groupFilter);
  queryString.append('page', currentPage.toString());
  queryString.append('limit', itemsPerPage.toString());

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/assets?${queryString.toString()}`;
  const { data: assets, loading, refetch } = useGet<any>(url);

  if (!Array.isArray(assets)) return null;

  const totalPages = 1;
  const currentItems = assets;

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (departmentFilter) params.append('department', departmentFilter);
    if (roomFilter) params.append('room', roomFilter);
    if (groupFilter) params.append('group', groupFilter);
    params.append('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleAddNewAssets = () => {
    setShowAddNewAssets(!showAddNewAssets);
  };

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-10">
      {!showAddNewAssets && (
        <div className="w-full overflow-x-auto">
          <AssetsTable
            tableData={currentItems}
            goToPage={goToPage}
            refetch={refetch}
            handleAddNewAssets={handleAddNewAssets}
            showAddNewAssets={showAddNewAssets}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}

      {showAddNewAssets && (
        <div className="w-full flex items-center justify-center mt-6">
          <AddNewEssets
            refetch={refetch}
            isOpen={showAddNewAssets}
            onClose={handleAddNewAssets}
          />
        </div>
      )}
    </div>
  );
};

export default Tables;
