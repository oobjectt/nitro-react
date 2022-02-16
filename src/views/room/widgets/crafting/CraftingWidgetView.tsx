import { CraftableProductsEvent, CraftingRecipeEvent, GetCraftableProductsComposer, GetCraftingRecipeComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { RoomWidgetCraftingEvent } from '../../../../api/nitro/room/widgets/events/RoomWidgetCraftingEvent';
import { BatchUpdates, CreateEventDispatcherHook, CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../layout';
import { GetInventoryGroupItems } from '../../../inventory/common/InventoryGroupItems';
import { useRoomContext } from '../../context/RoomContext';
import { ActiveCraftingIngredientsView } from './active-crafting-ingredients/ActiveCraftingIngredientsView';
import { CraftingActiveRecipeView } from './active-recipe/CraftingActiveRecipeView';
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
    const [ activeIngredients, setActiveIngredients ] = useState<CraftingFurnitureItem[]>([]);
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

    const onCraftingRecipeEvent = useCallback( (event: CraftingRecipeEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const itemIds: number[] = [];
        parser.ingredients.forEach(ingredient =>
            {
                //todo: this
                const item = ingredients.find( ingr => ingr.productCode === ingredient.itemName)
                if(item)
                {
                    for(let i = 0; i < ingredient.count; i++)
                    {
                        const itemId = item.getItemToMixer();
                        if(itemId > 0) itemIds.push(itemId);
                    }
                }
            });
    }, [ingredients]);

    CreateMessageHook(CraftableProductsEvent, onCraftableProductsEvent);
    CreateMessageHook(CraftingRecipeEvent, onCraftingRecipeEvent);

    const selectRecipe = useCallback( (recipe: CraftingFurnitureItem) =>
    {
        console.log(recipe)
        setSelectedProduct(recipe);
        setCraftingMode(MODE_PUBLIC_RECIPE);
        SendMessageHook(new GetCraftingRecipeComposer(recipe.productCode))
    }, []);

    const onIngredientClick = useCallback( (ingredient: CraftingFurnitureItem) =>
    {
        if(craftingMode === MODE_PUBLIC_RECIPE) return;

        if(craftingMode === MODE_NONE)
        {
            setCraftingMode(MODE_SECRET_RECIPE);
        }

        activeIngredients.push(ingredient);
    }, [activeIngredients, craftingMode]);

    useEffect( () =>
    {
        if(objectId !== -1) SendMessageHook(new GetCraftableProductsComposer(objectId));
    }, [objectId]);

    if(objectId === -1) return null;
    
    return (
        <NitroCardView className="nitro-crafting-widget" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('crafting.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="p-0 bg-muted">
                <NitroLayoutGrid>
                    <NitroLayoutGridColumn className="p-2" size={ 6 } overflow="auto">
                        <CraftingRecipesView recipes={ recipes } onRecipeClick={ selectRecipe }/>
                        <CraftingIngredientsView ingredients={ ingredients } onIngredientClick={onIngredientClick} />
                    </NitroLayoutGridColumn>
                    <NitroLayoutGridColumn className="p-2" size={ 6 }>
                        <ActiveCraftingIngredientsView ingredients={ ingredients }/>
                        <CraftingActiveRecipeView activeRecipe={  selectedProduct } />
                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
