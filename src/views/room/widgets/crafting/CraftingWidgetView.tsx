import { CraftableProductsEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/crafting/CraftableProductsEvent';
import { GetCraftingRecipeComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/crafting/GetCraftingRecipeComposer';
import { CraftingResultObjectParser } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/crafting/CraftingResultObjectParser';
import { FC, useCallback, useEffect, useState } from 'react';
import { RoomWidgetCraftingEvent } from '../../../../api/nitro/room/widgets/events/RoomWidgetCraftingEvent';
import { BatchUpdates, CreateEventDispatcherHook, CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../layout';
import { useRoomContext } from '../../context/RoomContext';
import { CraftingIngredientsView } from './crafting-ingredients/CraftingIngredientsView';
import { CraftingRecipesView } from './crafting-recipes/CraftingRecipesView';

const MODE_NONE = 0;
const MODE_SECRET_RECIPE = 1;
const MODE_PUBLIC_RECIPE = 2;

export const CraftingWidgetView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ recipes, setRecipes ] = useState<CraftingResultObjectParser[]>(null);
    const [ ingredients, setIngredients ] = useState<string[]>(null);
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

        BatchUpdates(() =>
        {
            setRecipes(parser.recipes);
            setIngredients(parser.ingredients);
        });
    }, []);

    CreateMessageHook(CraftableProductsEvent, onCraftableProductsEvent);

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
                        <CraftingRecipesView recipes={ recipes } />
                        <CraftingIngredientsView ingredients={ ingredients } />
                    </NitroLayoutGridColumn>
                    <NitroLayoutGridColumn size={ 6 }>

                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
