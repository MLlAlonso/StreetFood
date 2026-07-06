export const FOOD_CATEGORIES = [
  "Pizza",
  "Burgers",
  "Desserts",
  "Coffee",
  "Hot Dogs",
  "Boneless",
  "Sushi",
  "SeaFood",
  "Japanese",
  "Italian",
  "Mexican",
  "Chinese",
] as const;

export type FoodCategory =
    typeof FOOD_CATEGORIES[number];