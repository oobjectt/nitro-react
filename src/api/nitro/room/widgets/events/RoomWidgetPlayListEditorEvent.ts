import { RoomWidgetUpdateEvent } from '.';

export class RoomWidgetPlayListEditorEvent extends RoomWidgetUpdateEvent
{
    public static readonly SHOW_PLAYLIST_EDITOR = 'RWPLEE_SHOW_PLAYLIST_EDITOR';
    public static readonly HIDE_PLAYLIST_EDITOR = 'RWPLEE_HIDE_PLAYLIST_EDITOR';
    public static readonly INVENTORY_UPDATED = 'RWPLEE_INVENTORY_UPDATED';
    public static readonly SONG_DISK_INVENTORY_UPDATED = 'RWPLEE_SONG_DISK_INVENTORY_UPDATED';
    public static readonly PLAY_LIST_UPDATED = 'RWPLEE_PLAY_LIST_UPDATED';
    public static readonly PLAY_LIST_FULL = 'RWPLEE_PLAY_LIST_FULL';

    private _furniId:number;

    constructor(type: string, furniId: number)
    {
        super(type);
        this._furniId = furniId;
    }

    public get furniId(): number
    {
        return this._furniId;
    }
}
