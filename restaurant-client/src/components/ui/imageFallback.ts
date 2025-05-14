export const withFallback = (imageUrl?: string, fallback = '/food-restaurant-icon.svg') => {
  return imageUrl?.trim() ? imageUrl : fallback;
};
