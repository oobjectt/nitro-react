import { FC, useMemo } from 'react';
import { GetRoomEngine } from '../../../../../api';
import { NitroLayoutFlex, NitroLayoutFlexColumn } from '../../../../../layout';
import { CraftingActiveRecipeProps } from './CraftingActiveRecipeView.types';

export const CraftingActiveRecipeView: FC<CraftingActiveRecipeProps> = props =>
{
    const { activeRecipe = null } = props;

    const getImageUrl = useMemo(() =>
    {
        if(!activeRecipe) return null;
        
        return GetRoomEngine().getFurnitureFloorIconUrl(activeRecipe.furnitureData.id);
    }, [activeRecipe]);

    if(!activeRecipe) return null;
    
    return (
        <NitroLayoutFlexColumn className="h-100 p-2 bg-test rounded" gap={ 1 } overflow="hidden">
            <NitroLayoutFlex gap={ 2 } className="justify-content-between align-items-center h-100">
                <div className="text-muted fs-lg">{ activeRecipe.furnitureData.name }</div>
                <div className="crafting-item-icon-preview" style={ { backgroundImage: `url(${getImageUrl})` } }></div>
            </NitroLayoutFlex>
        </NitroLayoutFlexColumn>
    )
}
