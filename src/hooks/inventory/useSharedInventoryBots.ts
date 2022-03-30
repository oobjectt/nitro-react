import { BotAddedToInventoryEvent, BotData, BotInventoryMessageEvent, BotRemovedFromInventoryEvent, GetBotInventoryComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { useSharedInventoryUnseenTracker } from '.';
import { UseMessageEventHook } from '..';
import { cancelRoomObjectPlacement, CreateLinkEvent, getPlacingItemId, IBotItem, SendMessageComposer, UnseenItemCategory } from '../../api';
import { useSharedVisibility } from '../useSharedVisibility';

const useInventoryBots = () =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ needsUpdate, setNeedsUpdate ] = useState(true);
    const [ botItems, setBotItems ] = useState<IBotItem[]>([]);
    const [ selectedBot, setSelectedBot ] = useState<IBotItem>(null);
    const { isUnseen = null } = useSharedInventoryUnseenTracker();

    const selectBot = (bot: IBotItem) => setSelectedBot(bot);

    const onBotInventoryMessageEvent = useCallback((event: BotInventoryMessageEvent) =>
    {
        const parser = event.getParser();

        setBotItems(prevValue =>
            {
                const newValue = [ ...prevValue ];
                const existingIds = newValue.map(item => item.botData.id);
                const addedDatas: BotData[] = [];

                for(const botData of parser.items.values()) ((existingIds.indexOf(botData.id) === -1) && addedDatas.push(botData));

                for(const existingId of existingIds)
                {
                    let remove = true;

                    for(const botData of parser.items.values())
                    {
                        if(botData.id === existingId)
                        {
                            remove = false;

                            break;
                        }
                    }

                    if(!remove) continue;

                    const index = newValue.findIndex(item => (item.botData.id === existingId));
                    const botItem = newValue[index];

                    if((index === -1) || !botItem) continue;

                    if(getPlacingItemId() === botItem.botData.id)
                    {
                        cancelRoomObjectPlacement();

                        CreateLinkEvent('inventory/open');
                    }

                    newValue.splice(index, 1);
                }

                for(const botData of addedDatas)
                {
                    const botItem = { botData } as IBotItem;
                    const unseen = isUnseen(UnseenItemCategory.BOT, botData.id);

                    if(unseen) newValue.unshift(botItem);
                    newValue.push(botItem);
                }

                return newValue;
            });
    }, [ isUnseen ]);

    UseMessageEventHook(BotInventoryMessageEvent, onBotInventoryMessageEvent);

    const onBotAddedToInventoryEvent = useCallback((event: BotAddedToInventoryEvent) =>
    {
        const parser = event.getParser();

        setBotItems(prevValue =>
            {
                const newValue = [ ...prevValue ];

                const index = newValue.findIndex(item => (item.botData.id === parser.item.id));

                if(index >= 0) return prevValue;

                const botItem = { botData: parser.item } as IBotItem;

                newValue.push(botItem);

                return newValue;
            });
    }, []);

    UseMessageEventHook(BotAddedToInventoryEvent, onBotAddedToInventoryEvent);

    const onBotRemovedFromInventoryEvent = useCallback((event: BotRemovedFromInventoryEvent) =>
    {
        const parser = event.getParser();

        setBotItems(prevValue =>
            {
                const newValue = [ ...prevValue ];

                const index = newValue.findIndex(item => (item.botData.id === parser.itemId));

                if(index === -1) return prevValue;

                newValue.splice(index, 1);

                if(getPlacingItemId() === parser.itemId)
                {
                    cancelRoomObjectPlacement();

                    CreateLinkEvent('inventory/show');
                }

                return newValue;
            });
    }, []);

    UseMessageEventHook(BotRemovedFromInventoryEvent, onBotRemovedFromInventoryEvent);

    useEffect(() =>
    {
        if(!botItems || !botItems.length) return;

        setSelectedBot(prevValue =>
            {
                let newValue = prevValue;

                if(newValue && (botItems.indexOf(newValue) === -1)) newValue = null;

                if(!newValue) newValue = botItems[0];

                return newValue;
            });
    }, [ botItems ]);

    useEffect(() =>
    {
        if(!isVisible || !needsUpdate) return;

        SendMessageComposer(new GetBotInventoryComposer());

        setNeedsUpdate(false);
    }, [ isVisible, needsUpdate ]);

    return { botItems, selectedBot, selectBot, setIsVisible };
}

export const useSharedInventoryBots = () =>
{
    const { setIsVisible, ...rest } = useBetween(useInventoryBots);
    const { isVisible = false, activate = null, deactivate = null } = useSharedVisibility();

    useEffect(() =>
    {
        const id = activate();

        return () => deactivate(id);
    }, [ activate, deactivate ]);

    useEffect(() =>
    {
        setIsVisible(isVisible);
    }, [ isVisible, setIsVisible ]);

    return { ...rest };
}