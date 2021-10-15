import { FC, useCallback } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlexColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { ActiveCraftingIngredientsViewProps } from './ActiveCraftingIngredientsView.types';

export const ActiveCraftingIngredientsView: FC<ActiveCraftingIngredientsViewProps> = props =>
{
    const { ingredients = null } = props;

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);
    
    return (
        <NitroLayoutFlexColumn className="h-100" gap={ 1 } overflow="hidden">
             <NitroLayoutBase className="flex-shrink-0 bg-muted text-center rounded fw-bold text-black text-truncate">{ LocalizeText('crafting.title.mixer') }</NitroLayoutBase>
            <NitroCardGridView>
                { ingredients && (ingredients.length > 0) && ingredients.map((ingredient, index) =>
                    {
                        return <NitroCardGridItemView key={index} className={ !ingredient.countInInventory ? 'opacity-0-5 ' : '' } itemImage={ getImageUrl(ingredient.furnitureData.id) } itemActive={ false } itemCount={ ingredient.countInInventory }/>;
                    }) }
            </NitroCardGridView>
        </NitroLayoutFlexColumn>
    )
}
