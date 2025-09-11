/**
 * Utility functions for calculating TTL (Time To Live) values
 */

/**
 * Calculate TTL timestamp for DynamoDB
 * @param days Number of days from now
 * @returns TTL timestamp in seconds
 */
export const calculateTTL = (days: number): number => {
  return Math.floor(Date.now() / 1000) + (days * 24 * 60 * 60);
};

/**
 * Predefined TTL values for different data types
 */
export const TTL_VALUES = {
  EVENT_LOG: 7,     
  PRODUCT_ANALYTICS: 30,  
  SELLER_ANALYTICS: 90,   
  CATEGORY_ANALYTICS: 90, 
} as const;
