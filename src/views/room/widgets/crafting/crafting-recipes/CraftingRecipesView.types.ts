import { CraftingFurnitureItem } from '../utils/CraftingFurnitureItem';
export interface CraftingRecipesViewProps
{
    recipes: CraftingFurnitureItem[];
    onRecipeClick: (recipe: CraftingFurnitureItem) => void;
}
