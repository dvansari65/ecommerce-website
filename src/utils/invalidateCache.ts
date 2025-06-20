import { myCache } from "../app";
import { invalidateProps } from "../types/types";

export const cachekeys = new Set<string>();

export const addCacheKey = (key: string) => {
    cachekeys.add(key);
};

export const invalidateKeys = ({
    product,
    order,
    review,
    user,
    coupon,
    admin
}: invalidateProps) => {
    const keysToDelete: string[] = [];

    cachekeys.forEach((key) => {
        if (
            (product && (
                key.startsWith("all-products") ||
                key.startsWith("product-") ||     // for single products
                key.startsWith("products-page-") || // paginated filtered list
                key.startsWith("products-category")
            )) ||
            (order && (
                key.startsWith("order") ||
                key.startsWith("my-orders") ||
                key.startsWith("all-orders")
            )) ||
            (review && (
                key.startsWith("single-review") ||
                key.startsWith("all-reviews")
            )) ||
            (user && (
                key.startsWith("single-user") ||
                key.startsWith("all-users")
            )) ||
            (coupon && (
                key.startsWith("coupon") ||
                key.startsWith("all-coupons")
            )) ||
            (admin && (
                key.startsWith("stats") ||
                key.startsWith("line-chart") ||
                key.startsWith("key-chart")
            ))
        ) {
            keysToDelete.push(key);
        }
    });

    // Delete collected keys
    for (const key of keysToDelete) {
        myCache.del(key);
        cachekeys.delete(key);
    }

    console.log(`🔁 Invalidated ${keysToDelete.length} cache keys`);
};
