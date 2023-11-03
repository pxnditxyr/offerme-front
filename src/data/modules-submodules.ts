export const adminMenuData = [
    {
      label: 'Categories',
      name: 'categories',
      isExpanded: false,
      crud: true,
      link: '/management/categories',
    },
    {
      label: 'Companies',
      name: 'companies',
      isExpanded: false,
      crud: true,
      link: '/management/companies',
    },
    {
      label: 'Products',
      name: 'products',
      isExpanded: false,
      crud: true,
      link: '/management/products',
    },
    {
      label: 'Parameters',
      name: 'parameters',
      isExpanded: false,
      crud: true,
      link: '/management/parameters',
    },
    {
      label: 'Users',
      name: 'users',
      isExpanded: false,
      crud: true,
      link: '/management/users',
    },
    {
      label: 'Promotions',
      name: 'promotions',
      isExpanded: false,
      crud: false,
      link: '/management/promotions',
      submenu: [
        {
          label: 'Promotions',
          name: 'promotions-sub',
          isExpanded: false,
          crud: true,
          link: '/management/promotions',
        },
        {
          label: 'Code Promotions',
          name: 'code-promotions',
          isExpanded: false,
          crud: true,
          link: '/management/promotions/code-promotions',
        },
      ],
    },
    {
      label: 'Reviews',
      name: 'reviews',
      isExpanded: false,
      crud: true,
      link: '/management/reviews',
    },
  ]