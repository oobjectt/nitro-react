import { FC, useCallback } from 'react';
import { GetRoomEngine } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlexColumn } from '../../../../../layout';
import { ActiveCraftingIngredientsViewProps } from './ActiveCraftingIngredientsView.types';

export const ActiveCraftingIngredientsView: FC<ActiveCraftingIngredientsViewProps> = props =>
{
    const { ingredients = null } = props;

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);
    
    return (
        <NitroLayoutFlexColumn className="h-100 p-2 bg-test rounded" gap={ 1 } overflow="hidden">
            <NitroCardGridView>
                { ingredients && (ingredients.length > 0) && ingredients.map((ingredient, index) =>
                    {
                        return <NitroCardGridItemView key={index} className={ !ingredient.countInInventory ? 'opacity-0-5 ' : '' } itemImage={ getImageUrl(ingredient.furnitureData.id) } itemActive={ true } itemCount={ ingredient.countInInventory }/>;
                    }) }
            </NitroCardGridView>            
        </NitroLayoutFlexColumn>
    )
}
