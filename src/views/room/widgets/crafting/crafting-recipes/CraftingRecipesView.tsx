import { FC, useCallback } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlexColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { CraftingRecipesViewProps } from './CraftingRecipesView.types';

export const CraftingRecipesView: FC<CraftingRecipesViewProps> = props =>
{
    const { recipes = null, onRecipeClick = null } = props;

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);
    
    return (
        <NitroLayoutFlexColumn className="h-100" gap={ 1 } overflow="hidden">
            <NitroLayoutBase className="flex-shrink-0 bg-muted text-center rounded fw-bold text-black text-truncate">{ LocalizeText('crafting.title.products') }</NitroLayoutBase>
            <NitroCardGridView>
                { recipes && (recipes.length > 0) && recipes.map((recipe, index) =>
                    {
                        return <NitroCardGridItemView key={index} itemImage={ getImageUrl(recipe.furnitureData.id) } itemActive={ false } onClick={ () => onRecipeClick(recipe) } />;
                    })
                }
            </NitroCardGridView>
        </NitroLayoutFlexColumn>
    )
}
