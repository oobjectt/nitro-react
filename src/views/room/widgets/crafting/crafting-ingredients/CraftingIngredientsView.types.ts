import { CraftingFurnitureItem } from '../utils/CraftingFurnitureItem';

export interface CraftingIngredientsViewProps
{
    ingredients: CraftingFurnitureItem[];
    onIngredientClick(ingredient: CraftingFurnitureItem): void;
}
