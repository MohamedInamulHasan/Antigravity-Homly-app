import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../utils/api';

// Keys for cache invalidation
export const productKeys = {
    all: ['products'],
    lists: () => [...productKeys.all, 'list'],
    list: (filters) => [...productKeys.lists(), { ...filters }],
    details: () => [...productKeys.all, 'detail'],
    detail: (id) => [...productKeys.details(), id]
};

// 1. Fetch Request hooks
export const useProducts = (params = { limit: 50, page: 1 }) => {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: async () => {
            const response = await apiService.getProducts(params);
            return response.data; // Assumption: apiService returns { success: true, data: [...] }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        keepPreviousData: true
    });
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            const response = await apiService.getProduct(id);
            return response.data;
        },
        enabled: !!id // Only run if ID is provided
    });
};

// 2. Mutation hooks
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newProduct) => apiService.createProduct(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries(productKeys.lists()); // Refresh lists
        }
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => apiService.updateProduct(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(productKeys.lists());
            queryClient.invalidateQueries(productKeys.detail(variables.id));
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => apiService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries(productKeys.lists());
        }
    });
};
