// Utility functions for tutorial content

import tutorialDatabase from '../data/tutorial-database.json';

/**
 * Check if a product has tutorial content
 * @param {string} productHandle - The product handle
 * @returns {boolean} - True if product has tutorial content
 */
export const hasTutorialContent = (productHandle) => {
  return !!tutorialDatabase[productHandle];
};

/**
 * Get tutorial data for a product
 * @param {string} productHandle - The product handle
 * @returns {object|null} - Tutorial data or null if not found
 */
export const getTutorialData = (productHandle) => {
  return tutorialDatabase[productHandle] || null;
};

/**
 * Get all product handles that have tutorial content
 * @returns {string[]} - Array of product handles with tutorials
 */
export const getProductsWithTutorials = () => {
  return Object.keys(tutorialDatabase);
};

/**
 * Get tutorial summary for a product
 * @param {string} productHandle - The product handle
 * @returns {object|null} - Summary of tutorial content
 */
export const getTutorialSummary = (productHandle) => {
  const data = tutorialDatabase[productHandle];
  if (!data) return null;

  return {
    hasVideo: !!data.video,
    stepCount: data.steps ? data.steps.length : 0,
    hasPromotions: data.promotions ? data.promotions.length > 0 : false,
    videoTitle: data.video?.title || null
  };
};
