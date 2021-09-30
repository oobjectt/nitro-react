import { FC, useCallback } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeText } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView } from '../../../../../layout';
import { CraftingIngredientsViewProps } from './CraftingIngredientsView.types';

export const CraftingIngredientsView: FC<CraftingIngredientsViewProps> = props =>
{
    const { ingredients = null } = props;

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);

    return (
        <>
            <div>{LocalizeText('crafting.title.mixer')}</div>
            <NitroCardGridView columns={ 5 }>
            {
                ingredients && ingredients.map( (item, index) =>
                    {
                        const itemData = GetSessionDataManager().getFloorItemDataByName(item);
                        return (
                            <NitroCardGridItemView itemImage={ getImageUrl(itemData.id) } itemActive={ false } />
                        )
                    }
                )
            }
            </NitroCardGridView>
        </>
    )
}
