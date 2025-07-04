/* eslint-disable */

import { HiX } from 'react-icons/hi';
import Links from './components/Links';

import SidebarCard from 'components/sidebar/components/SidebarCard';
import { IRoute } from 'types/navigation';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  
  return (
     <div dir='rtl'
      className={`sm:none duration-175 ${
        open ? 'block' : ' hidden'
        } linear fixed z-50 right-0 xl:block flex h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 
        
      `}
    >
      {/* زر الإغلاق للشاشات الصغيرة */}
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden "
        onClick={() => setOpen(!open)}
      >
        <HiX className="text-2xl" />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          جرد <span className="font-medium">الاصول</span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1" dir='rtl'>
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}
      <div className="flex justify-center   ">
        <SidebarCard />
      </div>

      {/* Nav item end */}
    </div>
  );
}

export default SidebarHorizon;
