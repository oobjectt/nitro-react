import { NitroEvent } from '@nitrots/nitro-renderer/src/core/events/NitroEvent';
import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer/src/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomWidgetEnum } from '@nitrots/nitro-renderer/src/nitro/ui/widget/enums/RoomWidgetEnum';
import { GetRoomEngine } from '../../GetRoomEngine';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetCraftingEvent } from '../events/RoomWidgetCraftingEvent';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class CraftingWidgetHandler extends RoomWidgetHandler
{
    private _lastFurniId: number = -1;

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                const roomObject = GetRoomEngine().getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);

                if(!roomObject) return;

                this._lastFurniId = widgetEvent.objectId;
                

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetCraftingEvent(roomObject.id));
                return;
            }
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET: {
                const widgetEvent = (event as RoomEngineTriggerWidgetEvent);

                if(widgetEvent.objectId !== this._lastFurniId) return;

                this.container.eventDispatcher.dispatchEvent(new RoomWidgetCraftingEvent(-1));
                return;
            }
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.CRAFTING;
    }

    public get eventTypes(): string[]
    {
        return [RoomEngineTriggerWidgetEvent.OPEN_WIDGET, RoomEngineTriggerWidgetEvent.CLOSE_WIDGET];
    }

    public get messageTypes(): string[]
    {
        return [];
    }
}
