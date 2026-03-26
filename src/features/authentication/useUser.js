import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';

//Get current User and store in cache
// export function useUser() {
//   const {
//     isLoading,
//     data: user,
//     error,
//   } = useQuery({
//     queryKey: ['user'],
//     queryFn: getCurrentUser,
//   });
//   console.log('AUTH CHECK', user?.user?.role);
//   return {
//     isPending: isLoading,
//     user,
//     isAuthenticated: user?.user?.role === 'authenticated',
//   };
// }

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
  });

  return {
    isLoading,
    user,
    isAuthenticated: !!user,
  };
}
