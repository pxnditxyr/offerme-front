import { IModule } from '~/interfaces';

export const modulesData : IModule[] = [
  {
    name: 'categories',
    label: 'Categories',
    submodules: [
      {
        name: 'categories',
        label: 'Categories',
      },
      {
        name: 'category-images',
        label: 'Category Images',
      },
    ],
  },
  {
    name: 'companies',
    label: 'Companies',
    submodules: [
      {
        name: 'companies',
        label: 'Companies',
      },
      {
        name: 'company-address',
        label: 'Company Addresses',
      },
      {
        name: 'company-categories',
        label: 'Company Categories',
      },
      {
        name: 'company-logos',
        label: 'Company Logos',
      },
      {
        name: 'company-phones',
        label: 'Company Phones',
      },
      {
        name: 'company-users',
        label: 'Company Users',
      },
    ],
  },
  {
    name: 'contact-information',
    label: 'Contact Information',
    submodules: [
      {
        name: 'addresses',
        label: 'Addresses',
      },
      {
        name: 'phones',
        label: 'Phones',
      },
    ],
  },
  {
    name: 'parameters',
    label: 'Parameters',
    submodules: [
      {
        name: 'parameters',
        label: 'Parameters',
      },
      {
        name: 'subparameters',
        label: 'Subparameters',
      },
    ],
  },
  {
    name: 'payments',
    label: 'Payments',
    submodules: [
      {
        name: 'credit-cards',
        label: 'Credit Cards',
      },
    ],
  },
  {
    name: 'products',
    label: 'Products',
    submodules: [
      {
        name: 'products',
        label: 'Products',
      },
      {
        name: 'product-categories',
        label: 'Product Categories',
      },
      {
        name: 'product-images',
        label: 'Product Images',
      }
    ],
  },
  {
    name: 'promotions',
    label: 'Promotions',
    submodules: [
      {
        name: 'promotions',
        label: 'Promotions',
      },
      {
        name: 'promotion-images',
        label: 'Promotion Images',
      },
      {
        name: 'promotion-payments',
        label: 'Promotion Payments',
      },
      {
        name: 'promotion-requests',
        label: 'Promotion Requests',
      },
      {
        name: 'promotion-status',
        label: 'Promotion Status',
      },
      {
        name: 'promotion-target-products',
        label: 'Promotion Target Products',
      },
      {
        name: 'discount-products',
        label: 'Discount Products',
      },
      {
        name: 'code-promotion-discount-products',
        label: 'Code Promotion Discount Products',
      }
    ],
  },
  {
    name: 'reviews',
    label: 'Reviews',
    submodules: [
      {
        name: 'reviews',
        label: 'Reviews',
      },
      {
        name: 'comments',
        label: 'Comments',
      },
      {
        name: 'promotion-reviews',
        label: 'Promotion Reviews',
      },
      {
        name: 'company-reviews',
        label: 'Company Reviews',
      }
    ],
  },
  {
    name: 'users',
    label: 'Users',
    submodules: [
      {
        name: 'users',
        label: 'Users',
      },
      {
        name: 'user-addresses',
        label: 'User Addresses',
      },
      {
        name: 'user-avatars',
        label: 'User Avatars',
      },
      {
        name: 'user-credit-cards',
        label: 'User Credit Cards',
      },
      {
        name: 'user-phones',
        label: 'User Phones',
      },
      {
        name: 'roles',
        label: 'Roles',
      },
      {
        name: 'people-info',
        label: 'People Info',
      },
      {
        name: 'user-phones',
        label: 'User Phones',
      }
    ],
  }
]
