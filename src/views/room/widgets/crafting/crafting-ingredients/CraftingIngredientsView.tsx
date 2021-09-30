import { FC, useCallback } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeText } from '../../../../../api';
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
        <NitroLayoutFlexColumn className="h-100" gap={ 1 } overflow="hidden">
            <NitroLayoutBase className="flex-shrink-0 bg-muted text-center rounded fw-bold text-black text-truncate">{ LocalizeText('crafting.title.mixer') }</NitroLayoutBase>
            <NitroCardGridView>
                { ingredients && (ingredients.length > 0) && ingredients.map((ingredient, index) =>
                    {
                        const furniData = GetSessionDataManager().getFloorItemDataByName(ingredient);

                        return <NitroCardGridItemView key={index} itemImage={ getImageUrl(furniData.id) } itemActive={ false } />;
                    }) }
            </NitroCardGridView>
        </NitroLayoutFlexColumn>
    );
}
