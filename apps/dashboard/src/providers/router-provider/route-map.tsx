import { RouteObject } from 'react-router-dom';

import { ProtectedRoute } from '../../components/authentication/protected-route';
import { MainLayout } from '../../components/layouts/main-layout';
import { SettingsLayout } from '../../components/layouts/settings-layout';
import { ErrorBoundary } from '../../components/utilities/error-boundary';

export const RouteMap: RouteObject[] = [
  {
    path: '/login',
    lazy: () => import('../../routes/login'),
  },
  {
    path: '/',
    lazy: () => import('../../routes/home'),
  },
  {
    path: '*',
    lazy: () => import('../../routes/no-match'),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: '/products',
            handle: {
              crumb: () => 'Products',
            },
            children: [
              {
                path: '',
                lazy: () => import('../../routes/products/product-list'),
                // children: [
                //   {
                //     path: 'create',
                //     lazy: () => import('../../routes/products/product-create'),
                //   },
                // ],
              },
              // {
              //   path: ':id',
              //   lazy: () => import('../../routes/products/product-detail'),
              //   handle: {
              //     crumb: (data: HttpTypes.AdminProductResponse) =>
              //       data.product.title,
              //   },
              //   children: [
              //     {
              //       path: 'edit',
              //       lazy: () => import('../../routes/products/product-edit'),
              //     },
              //     {
              //       path: 'sales-channels',
              //       lazy: () =>
              //         import('../../routes/products/product-sales-channels'),
              //     },
              //     {
              //       path: 'attributes',
              //       lazy: () =>
              //         import('../../routes/products/product-attributes'),
              //     },
              //     {
              //       path: 'organization',
              //       lazy: () =>
              //         import('../../routes/products/product-organization'),
              //     },
              //     {
              //       path: 'media',
              //       lazy: () => import('../../routes/products/product-media'),
              //     },
              //     {
              //       path: 'prices',
              //       lazy: () => import('../../routes/products/product-prices'),
              //     },
              //     {
              //       path: 'options/create',
              //       lazy: () =>
              //         import('../../routes/products/product-create-option'),
              //     },
              //     {
              //       path: 'options/:option_id/edit',
              //       lazy: () =>
              //         import('../../routes/products/product-edit-option'),
              //     },
              //     {
              //       path: 'variants/create',
              //       lazy: () =>
              //         import('../../routes/products/product-create-variant'),
              //     },
              //     {
              //       path: 'variants/:variant_id/edit',
              //       lazy: () =>
              //         import('../../routes/products/product-edit-variant'),
              //     },
              //   ],
              // },
            ],
          },
          // {
          //   path: '/categories',
          //   handle: {
          //     crumb: () => 'Categories',
          //   },
          //   children: [
          //     {
          //       path: '',
          //       lazy: () => import('../../routes/categories/category-list'),
          //       children: [
          //         {
          //           path: 'create',
          //           lazy: () =>
          //             import('../../routes/categories/category-create'),
          //         },
          //         {
          //           path: 'organize',
          //           lazy: () =>
          //             import('../../routes/categories/category-organize'),
          //         },
          //       ],
          //     },
          //     {
          //       path: ':id',
          //       lazy: () => import('../../routes/categories/category-detail'),
          //       handle: {
          //         crumb: (data: AdminProductCategoryResponse) =>
          //           data.product_category.name,
          //       },
          //       children: [
          //         {
          //           path: 'edit',
          //           lazy: () => import('../../routes/categories/category-edit'),
          //         },
          //         {
          //           path: 'products',
          //           lazy: () =>
          //             import('../../routes/categories/category-products'),
          //         },
          //         {
          //           path: 'organize',
          //           lazy: () =>
          //             import('../../routes/categories/category-organize'),
          //         },
          //       ],
          //     },
          //   ],
          // },
          // {
          //   path: '/collections',
          //   handle: {
          //     crumb: () => 'Collections',
          //   },
          //   children: [
          //     {
          //       path: '',
          //       lazy: () => import('../../routes/collections/collection-list'),
          //       children: [
          //         {
          //           path: 'create',
          //           lazy: () =>
          //             import('../../routes/collections/collection-create'),
          //         },
          //       ],
          //     },
          //     {
          //       path: ':id',
          //       lazy: () =>
          //         import('../../routes/collections/collection-detail'),
          //       handle: {
          //         crumb: (data: { collection: HttpTypes.AdminCollection }) =>
          //           data.collection.title,
          //       },
          //       children: [
          //         {
          //           path: 'edit',
          //           lazy: () =>
          //             import('../../routes/collections/collection-edit'),
          //         },
          //         {
          //           path: 'products',
          //           lazy: () =>
          //             import(
          //               '../../routes/collections/collection-add-products'
          //             ),
          //         },
          //       ],
          //     },
          //   ],
          // },
          // {
          //   path: '/pricing',
          //   handle: {
          //     crumb: () => 'Pricing',
          //   },
          //   children: [
          //     {
          //       path: '',
          //       lazy: () => import('../../routes/pricing/pricing-list'),
          //       children: [
          //         {
          //           path: 'create',
          //           lazy: () => import('../../routes/pricing/pricing-create'),
          //         },
          //       ],
          //     },
          //     {
          //       path: ':id',
          //       lazy: () => import('../../routes/pricing/pricing-detail'),
          //       handle: {
          //         crumb: (data: PriceListRes) => data.price_list.title,
          //       },
          //       children: [
          //         {
          //           path: 'edit',
          //           lazy: () => import('../../routes/pricing/pricing-edit'),
          //         },
          //         {
          //           path: 'configuration',
          //           lazy: () =>
          //             import('../../routes/pricing/pricing-configuration'),
          //         },
          //         {
          //           path: 'products/add',
          //           lazy: () => import('../../routes/pricing/pricing-products'),
          //         },
          //         {
          //           path: 'products/edit',
          //           lazy: () =>
          //             import('../../routes/pricing/pricing-products-prices'),
          //         },
          //       ],
          //     },
          //   ],
          // },
          // {
          //   path: '/customers',
          //   handle: {
          //     crumb: () => 'Customers',
          //   },
          //   children: [
          //     {
          //       path: '',
          //       lazy: () => import('../../routes/customers/customer-list'),
          //       children: [
          //         {
          //           path: 'create',
          //           lazy: () =>
          //             import('../../routes/customers/customer-create'),
          //         },
          //       ],
          //     },
          //     {
          //       path: ':id',
          //       lazy: () => import('../../routes/customers/customer-detail'),
          //       handle: {
          //         // Re-add type when it's available again
          //         crumb: (data: any) => data.customer.email,
          //       },
          //       children: [
          //         {
          //           path: 'edit',
          //           lazy: () => import('../../routes/customers/customer-edit'),
          //         },
          //         {
          //           path: 'add-customer-groups',
          //           lazy: () =>
          //             import(
          //               '../../routes/customers/customers-add-customer-group'
          //             ),
          //         },
          //       ],
          //     },
          //   ],
          // },
          // {
          //   path: '/customer-groups',
          //   handle: {
          //     crumb: () => 'Customer Groups',
          //   },
          //   children: [
          //     {
          //       path: '',
          //       lazy: () =>
          //         import('../../routes/customer-groups/customer-group-list'),
          //       children: [
          //         {
          //           path: 'create',
          //           lazy: () =>
          //             import(
          //               '../../routes/customer-groups/customer-group-create'
          //             ),
          //         },
          //       ],
          //     },
          //     {
          //       path: ':id',
          //       lazy: () =>
          //         import('../../routes/customer-groups/customer-group-detail'),
          //       handle: {
          //         crumb: (data: {
          //           customer_group: HttpTypes.AdminCustomerGroup;
          //         }) => data.customer_group.name,
          //       },
          //       children: [
          //         {
          //           path: 'edit',
          //           lazy: () =>
          //             import(
          //               '../../routes/customer-groups/customer-group-edit'
          //             ),
          //         },
          //         {
          //           path: 'add-customers',
          //           lazy: () =>
          //             import(
          //               '../../routes/customer-groups/customer-group-add-customers'
          //             ),
          //         },
          //       ],
          //     },
          //   ],
          // },
          // {
          //   path: '/inventory',
          //   handle: {
          //     crumb: () => 'Inventory',
          //   },
          //   children: [
          //     {
          //       path: '',
          //       lazy: () => import('../../routes/inventory/inventory-list'),
          //       children: [
          //         {
          //           path: 'create',
          //           lazy: () =>
          //             import('../../routes/inventory/inventory-create'),
          //         },
          //       ],
          //     },
          //     {
          //       path: ':id',
          //       lazy: () => import('../../routes/inventory/inventory-detail'),
          //       handle: {
          //         crumb: (data: HttpTypes.AdminInventoryItemResponse) =>
          //           data.inventory_item.title ?? data.inventory_item.sku,
          //       },
          //       children: [
          //         {
          //           path: 'edit',
          //           lazy: () =>
          //             import(
          //               '../../routes/inventory/inventory-detail/components/edit-inventory-item'
          //             ),
          //         },
          //         {
          //           path: 'attributes',
          //           lazy: () =>
          //             import(
          //               '../../routes/inventory/inventory-detail/components/edit-inventory-item-attributes'
          //             ),
          //         },
          //         {
          //           path: 'locations',
          //           lazy: () =>
          //             import(
          //               '../../routes/inventory/inventory-detail/components/manage-locations'
          //             ),
          //         },
          //         {
          //           path: 'locations/:location_id',
          //           lazy: () =>
          //             import(
          //               '../../routes/inventory/inventory-detail/components/adjust-inventory'
          //             ),
          //         },

          //       ],
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/settings',
        element: <SettingsLayout />,
        // children: [
        //   {
        //     index: true,
        //     lazy: () => import('../../routes/settings'),
        //   },
        //   {
        //     path: 'profile',
        //     lazy: () => import('../../routes/profile/profile-detail'),
        //     handle: {
        //       crumb: () => 'Profile',
        //     },
        //     children: [
        //       {
        //         path: 'edit',
        //         lazy: () => import('../../routes/profile/profile-edit'),
        //       },
        //     ],
        //   },
        //   {
        //     path: 'regions',
        //     element: <Outlet />,
        //     handle: {
        //       crumb: () => 'Regions',
        //     },
        //     children: [
        //       {
        //         path: '',
        //         lazy: () => import('../../routes/regions/region-list'),
        //         children: [
        //           {
        //             path: 'create',
        //             lazy: () => import('../../routes/regions/region-create'),
        //           },
        //         ],
        //       },
        //       {
        //         path: ':id',
        //         lazy: () => import('../../routes/regions/region-detail'),
        //         handle: {
        //           crumb: (data: { region: HttpTypes.AdminRegion }) =>
        //             data.region.name,
        //         },
        //         children: [
        //           {
        //             path: 'edit',
        //             lazy: () => import('../../routes/regions/region-edit'),
        //           },
        //           {
        //             path: 'countries/add',
        //             lazy: () =>
        //               import('../../routes/regions/region-add-countries'),
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   {
        //     path: 'store',
        //     lazy: () => import('../../routes/store/store-detail'),
        //     handle: {
        //       crumb: () => 'Store',
        //     },
        //     children: [
        //       {
        //         path: 'edit',
        //         lazy: () => import('../../routes/store/store-edit'),
        //       },
        //       {
        //         path: 'currencies',
        //         lazy: () => import('../../routes/store/store-add-currencies'),
        //       },
        //     ],
        //   },
        //   {
        //     path: 'users',
        //     element: <Outlet />,
        //     handle: {
        //       crumb: () => 'Users',
        //     },
        //     children: [
        //       {
        //         path: '',
        //         lazy: () => import('../../routes/users/user-list'),
        //         children: [
        //           {
        //             path: 'invite',
        //             lazy: () => import('../../routes/users/user-invite'),
        //           },
        //         ],
        //       },
        //       {
        //         path: ':id',
        //         lazy: () => import('../../routes/users/user-detail'),
        //         handle: {
        //           crumb: (data: { user: UserDTO }) => data.user.email,
        //         },
        //         children: [
        //           {
        //             path: 'edit',
        //             lazy: () => import('../../routes/users/user-edit'),
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   {
        //     path: 'sales-channels',
        //     element: <Outlet />,
        //     handle: {
        //       crumb: () => 'Sales Channels',
        //     },
        //     children: [
        //       {
        //         path: '',
        //         lazy: () =>
        //           import('../../routes/sales-channels/sales-channel-list'),
        //         children: [
        //           {
        //             path: 'create',
        //             lazy: () =>
        //               import(
        //                 '../../routes/sales-channels/sales-channel-create'
        //               ),
        //           },
        //         ],
        //       },
        //       {
        //         path: ':id',
        //         lazy: () =>
        //           import('../../routes/sales-channels/sales-channel-detail'),
        //         handle: {
        //           crumb: (data: { sales_channel: SalesChannelDTO }) =>
        //             data.sales_channel.name,
        //         },
        //         children: [
        //           {
        //             path: 'edit',
        //             lazy: () =>
        //               import('../../routes/sales-channels/sales-channel-edit'),
        //           },
        //           {
        //             path: 'add-products',
        //             lazy: () =>
        //               import(
        //                 '../../routes/sales-channels/sales-channel-add-products'
        //               ),
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   {
        //     path: 'locations',
        //     element: <Outlet />,
        //     handle: {
        //       crumb: () => 'Locations & Shipping',
        //     },
        //     children: [
        //       {
        //         path: '',
        //         lazy: () => import('../../routes/locations/location-list'),
        //       },
        //       {
        //         path: 'create',
        //         lazy: () => import('../../routes/locations/location-create'),
        //       },
        //       {
        //         path: ':location_id',
        //         lazy: () => import('../../routes/locations/location-details'),
        //         children: [
        //           {
        //             path: 'edit',
        //             lazy: () => import('../../routes/locations/location-edit'),
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // ],
      },
    ],
  },
];
