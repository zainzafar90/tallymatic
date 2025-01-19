// import axios from 'axios';

// const client = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// client.interceptors.request.use((config) => {
//   const currentStore = localStorage.getItem('currentStore');
//   if (currentStore) {
//     const { id } = JSON.parse(currentStore);
//     config.headers['x-store-id'] = id;
//   }
//   return config;
// });
