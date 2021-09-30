import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export class RoomWidgetCraftingEvent extends RoomWidgetUpdateEvent
{
    public static CRAFTING: string = 'RWUEIE_CRAFTING';

    private _objectId: number;

    constructor(objectId: number)
    {
        super(RoomWidgetCraftingEvent.CRAFTING);

        this._objectId = objectId;
    }

    public get objectId(): number
    {
        return this._objectId;
    }
}
