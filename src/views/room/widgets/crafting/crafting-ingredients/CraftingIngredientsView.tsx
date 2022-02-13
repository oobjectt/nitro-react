import { FC, useCallback } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView, NitroLayoutFlexColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { CraftingIngredientsViewProps } from './CraftingIngredientsView.types';

export const CraftingIngredientsView: FC<CraftingIngredientsViewProps> = props =>
{
    const { ingredients = null } = props;

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);

    return (
        <NitroLayoutFlexColumn className="h-100 bg-test p-2 rounded" gap={ 1 } overflow="hidden">
            <NitroLayoutBase className="bg-muted text-center rounded p-1 text-truncate">{ LocalizeText('crafting.title.mixer') }</NitroLayoutBase>
            <NitroCardGridView>
                { ingredients && (ingredients.length > 0) && ingredients.map((ingredient, index) =>
                    {
                        return <NitroCardGridItemView key={index} className={ !ingredient.countInInventory ? 'opacity-0-5 ' : '' } itemImage={ getImageUrl(ingredient.furnitureData.id) } itemActive={ false } itemCount={ ingredient.countInInventory }/>;
                    }) }
            </NitroCardGridView>
        </NitroLayoutFlexColumn>
    );
}
