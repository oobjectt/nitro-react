import { RoomWidgetMessage } from '.';

export class RoomWidgetPlayListPlayStateMessage extends RoomWidgetMessage
{
    public static readonly TOGGLE_PLAY_PAUSE = 'RWPLPS_TOGGLE_PLAY_PAUSE';

    private _furniId:number;
    private _position:number;

    constructor(furniId:number, position:number=-1)
    {
        super(RoomWidgetPlayListPlayStateMessage.TOGGLE_PLAY_PAUSE);
        this._furniId = furniId;
        this._position = position;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get position(): number
    {
        return this._position;
    }
}
