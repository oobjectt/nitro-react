import { RoomWidgetMessage } from '.';

export class RoomWidgetPlayListModificationMessage extends RoomWidgetMessage
{
    public static readonly ADD_TO_PLAYLIST = 'RWPLAM_ADD_TO_PLAYLIST';
    public static readonly REMOVE_FROM_PLAYLIST = 'RWPLAM_REMOVE_FROM_PLAYLIST';

    private _diskId:number;
    private _slotNumber:number;

    constructor(type: string, slotNumber: number, diskId: number)
    {
        super(type);
        this._slotNumber = slotNumber;
        this._diskId = diskId;
    }

    public get diskId(): number
    {
        return this._diskId;
    }

    public get slotNumber(): number
    {
        return this._slotNumber;
    }
}
