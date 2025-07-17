import redis from "./redis"; // Ensure redis client is properly configured
import { invalidateProps } from "../types/types";

export const cachekeys = new Set<string>();

export const addCacheKey = async (key: string) => {
    cachekeys.add(key);
    await redis.sadd("cachekeys", key); // Add the key to Redis set
};

export const invalidateKeys = async ({
    product,
    order,
    review,
    user,
    coupon,
    admin,
    cart
}: invalidateProps) => {

    const keysToDelete: string[] = [];

    // Fetch all keys from Redis set
    const allKeys = await redis.smembers("cachekeys");
    allKeys.forEach((key) => {
        if (
            (product && (
                key.startsWith("all-products-page-") ||
                key.startsWith("product-") ||     // for single products
                key.startsWith("products-page-") || // paginated filtered list
                key.startsWith("products-category") ||
                key.startsWith("latest-product") ||
                key.startsWith("filter-products-")
            )) ||
            (order && (
                key.startsWith("single-order") ||
                key.startsWith("my-orders-page-") ||
                key.startsWith("all-orders")
            )) ||
            (review && (
                key.startsWith("single-review") ||
                key.startsWith("all-reviews") ||
                key.startsWith(`single-product-review`)
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
            )) ||
            (cart && (
                key.startsWith("all-carts") ||
                key.startsWith("single-cart-product")||
                key.startsWith("all-cart-products")
            ))
        ) {
            keysToDelete.push(key);
        }
    });

    // Delete collected keys from Redis
    for (const key of keysToDelete) {
        await redis.del(key); // Delete the key from Redis
        await redis.srem("cachekeys", key); // Remove the key from Redis set
        cachekeys.delete(key); // Remove the key from local set
    }

    console.log(`🔁 Invalidated ${keysToDelete.length} cache keys`);
};