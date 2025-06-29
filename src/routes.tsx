
const routes = [
  {
    name: 'الرئيسية',
    layout: '/admin',
    path: 'default',

  },
  {
    name:'ادارة الموظفين',
    layout: '/admin',
    path: 'empolyee',
  

    secondary: true,
  },
  {
    name: 'الاصول ',
    layout: '/admin',
  
    path: 'data-assets',
  },
  {
    name:'ادارة التقارير ',
    layout: '/admin',
    path: 'reports',

  },
  {
    name:'ادارة الاصول ',
    layout: '/admin',
    path: 'manage_asset',

  },
  {
    name:'ادارة الغرف ',
    layout: '/admin',
    path: 'rooms',

  },
 
];
export default routes;
