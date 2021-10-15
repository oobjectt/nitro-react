import { CraftableProductsEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/crafting/CraftableProductsEvent';
import { GetCraftableProductsComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/crafting/GetCraftableProductsComposer';
import { GetCraftingRecipeComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/crafting/GetCraftingRecipeComposer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager } from '../../../../api';
import { RoomWidgetCraftingEvent } from '../../../../api/nitro/room/widgets/events/RoomWidgetCraftingEvent';
import { BatchUpdates, CreateEventDispatcherHook, CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../layout';
import { GetInventoryGroupItems } from '../../../inventory/common/InventoryGroupItems';
import { useRoomContext } from '../../context/RoomContext';
import { ActiveCraftingIngredientsView } from './active-crafting-ingredients/ActiveCraftingIngredientsView';
import { CraftingIngredientsView } from './crafting-ingredients/CraftingIngredientsView';
import { CraftingRecipesView } from './crafting-recipes/CraftingRecipesView';
import { CraftingFurnitureItem } from './utils/CraftingFurnitureItem';

const MODE_NONE = 0;
const MODE_SECRET_RECIPE = 1;
const MODE_PUBLIC_RECIPE = 2;

export const CraftingWidgetView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ recipes, setRecipes ] = useState<CraftingFurnitureItem[]>(null);
    const [ ingredients, setIngredients ] = useState<CraftingFurnitureItem[]>(null);
    const [ craftingMode, setCraftingMode ] = useState(MODE_NONE);
    const [ selectedProduct, setSelectedProduct ] = useState<CraftingFurnitureItem>(null);
    const { eventDispatcher = null } = useRoomContext();

    const onClose = useCallback( () =>
    {
        setObjectId(-1);
    }, []);

    const onRoomWidgetCraftingEvent = useCallback((event: RoomWidgetCraftingEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetCraftingEvent.CRAFTING: {
                setObjectId(event.objectId);
            }
        }
    }, []);

    CreateEventDispatcherHook(RoomWidgetCraftingEvent.CRAFTING, eventDispatcher, onRoomWidgetCraftingEvent);

    const onCraftableProductsEvent = useCallback((event: CraftableProductsEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        if(!parser.isActive())
        {
            return;
        }

        const recipes: CraftingFurnitureItem[] = parser.recipes.map(recipe =>
        {
            const furniData = GetSessionDataManager().getFloorItemDataByName(recipe.itemName);
            const item =  new CraftingFurnitureItem(recipe.recipeName, furniData);
            return item;
        });

        const inventoryGroupItems = GetInventoryGroupItems();

        const ingredients: CraftingFurnitureItem[] = parser.ingredients.map(ingredient =>
        {
            const furniData = GetSessionDataManager().getFloorItemDataByName(ingredient);
            const item =  new CraftingFurnitureItem(null, furniData);
            
            const inventoryItems = inventoryGroupItems.find( group => group.type === item.typeId);

            if(inventoryItems) item.inventoryIds = inventoryItems.items.map(it => it.id);
            return item;
        });

        BatchUpdates(() =>
        {
            setRecipes(recipes);
            setIngredients(ingredients);
        });
    }, []);

    CreateMessageHook(CraftableProductsEvent, onCraftableProductsEvent);

    const selectRecipe = useCallback( (recipe: CraftingFurnitureItem) =>
    {
        setSelectedProduct(recipe);
        setCraftingMode(MODE_PUBLIC_RECIPE);
        SendMessageHook(new GetCraftableProductsComposer(recipe.productCode))
    }, []);

    useEffect( () =>
    {
        if(objectId !== -1) SendMessageHook(new GetCraftingRecipeComposer(objectId));
    }, [objectId]);

    if(objectId === -1) return null;
    
    return (
        <NitroCardView className="nitro-crafting-widget">
            <NitroCardHeaderView headerText="Crafting" onCloseClick={ onClose } />
            <NitroCardContentView>
                <NitroLayoutGrid>
                    <NitroLayoutGridColumn size={ 6 } overflow="auto">
                        <CraftingRecipesView recipes={ recipes } onRecipeClick={selectRecipe}/>
                        <CraftingIngredientsView ingredients={ ingredients } />
                    </NitroLayoutGridColumn>
                    <NitroLayoutGridColumn size={ 6 }>
                        <ActiveCraftingIngredientsView ingredients={ ingredients }/>
                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
