import { FC, useCallback, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlexColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { CraftingFurnitureItem } from '../utils/CraftingFurnitureItem';
import { CraftingRecipesViewProps } from './CraftingRecipesView.types';

export const CraftingRecipesView: FC<CraftingRecipesViewProps> = props =>
{
    const { recipes = null, onRecipeClick = null } = props;

    const [ selectedRecipeIndex, setSelectedRecipeIndex ] = useState<number>(0);

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);

    const selectRecipe = useCallback((recipe: CraftingFurnitureItem, index: number) =>
    {
        setSelectedRecipeIndex(index);
        onRecipeClick(recipe);
    }, [onRecipeClick]);
    
    return (
        <NitroLayoutFlexColumn className="h-100 bg-test rounded p-2" gap={ 1 } overflow="hidden">
            <NitroLayoutBase className="bg-muted text-center rounded p-1 text-truncate">{ LocalizeText('crafting.title.products') }</NitroLayoutBase>
            <NitroCardGridView>
                { recipes && (recipes.length > 0) && recipes.map((recipe, index) =>
                    {
                        return <NitroCardGridItemView key={index} itemImage={ getImageUrl(recipe.furnitureData.id) } itemActive={ selectedRecipeIndex === index } onClick={ () => selectRecipe(recipe, index) } />;
                    })
                }
            </NitroCardGridView>
        </NitroLayoutFlexColumn>
    )
}
