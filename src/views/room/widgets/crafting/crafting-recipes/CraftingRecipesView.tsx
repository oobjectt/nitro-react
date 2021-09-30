import { FC, useCallback } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeText } from '../../../../../api';
import { NitroCardGridItemView, NitroCardGridView } from '../../../../../layout';
import { CraftingRecipesViewProps } from './CraftingRecipesView.types';

export const CraftingRecipesView: FC<CraftingRecipesViewProps> = props =>
{
    const { recipes = null } = props;

    const getImageUrl = useCallback( (classId: number) =>
    {
        return GetRoomEngine().getFurnitureFloorIconUrl(classId);
    }, []);
    
    return (
        <>
            <div>{LocalizeText('crafting.title.products')}</div>
            <NitroCardGridView columns={ recipes.length }>
            {
                recipes && recipes.map( (item, index) =>
                    {
                        const itemData = GetSessionDataManager().getFloorItemDataByName(item.itemName);
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
