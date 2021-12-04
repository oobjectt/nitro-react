import { AddJukeboxDiskComposer, FurnitureMultiStateComposer, NitroEvent, RemoveJukeboxDiskComposer, RoomControllerLevel, RoomObjectSoundMachineEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { GetRoomEngine } from '../..';
import { GetSessionDataManager, IsOwnerOfFurniture } from '../../..';
import { SendMessageHook } from '../../../../../hooks';
import { RoomWidgetPlayListEditorEvent } from '../events/RoomWidgetPlayListEditorEvent';
import { RoomWidgetUpdateEvent } from '../events/RoomWidgetUpdateEvent';
import { RoomWidgetFurniToWidgetMessage } from '../messages';
import { RoomWidgetMessage } from '../messages/RoomWidgetMessage';
import { RoomWidgetPlayListModificationMessage } from '../messages/RoomWidgetPlayListModificationMessage';
import { RoomWidgetPlayListPlayStateMessage } from '../messages/RoomWidgetPlayListPlayStateMessage';
import { RoomWidgetPlayListUserActionMessage } from '../messages/RoomWidgetPlayListUserActionMessage';
import { RoomWidgetHandler } from './RoomWidgetHandler';

export class PlayListEditorWidgetHandler extends RoomWidgetHandler
{

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomObjectSoundMachineEvent.JUKEBOX_DISPOSE:
                const _local_2 = (event as RoomObjectSoundMachineEvent);
                const _local_3 = new RoomWidgetPlayListEditorEvent(RoomWidgetPlayListEditorEvent.HIDE_PLAYLIST_EDITOR, _local_2.objectId);
                this.container.eventDispatcher.dispatchEvent(_local_3);
                return;
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
            {
                case RoomWidgetFurniToWidgetMessage.REQUEST_PLAYLIST_EDITOR:
                    const _local_2 = (message as RoomWidgetFurniToWidgetMessage);
                    const _local_3 = GetRoomEngine().getRoomObject(_local_2.roomId, _local_2.objectId, _local_2.category);
                    
                    if(_local_3 != null)
                    {
                        const _local_7 = IsOwnerOfFurniture(_local_3);
                        const _local_8 = (((this.container.roomSession.isRoomOwner) || (this.container.roomSession.controllerLevel >= RoomControllerLevel.GUEST)) || (GetSessionDataManager().isModerator));
                        if(_local_7)
                        {
                            const _local_9 = new RoomWidgetPlayListEditorEvent(RoomWidgetPlayListEditorEvent.SHOW_PLAYLIST_EDITOR, _local_2.objectId);
                            this.container.eventDispatcher.dispatchEvent(_local_9);
                        }
                        else
                        {
                            if(_local_8)
                            {
                                SendMessageHook(new FurnitureMultiStateComposer(_local_3.id, -2));
                            }
                        }
                    }
                    break;
                case RoomWidgetPlayListModificationMessage.ADD_TO_PLAYLIST:
                    const _local_4 = (message as RoomWidgetPlayListModificationMessage);
                    SendMessageHook(new AddJukeboxDiskComposer(_local_4.diskId, _local_4.slotNumber));
                    break;
                case RoomWidgetPlayListModificationMessage.REMOVE_FROM_PLAYLIST:
                    const _local_5 = (message as RoomWidgetPlayListModificationMessage);
                    SendMessageHook(new RemoveJukeboxDiskComposer(_local_5.slotNumber));
                    break;
                case RoomWidgetPlayListPlayStateMessage.TOGGLE_PLAY_PAUSE:
                    const _local_6 = (message as RoomWidgetPlayListPlayStateMessage);
                    SendMessageHook(new FurnitureMultiStateComposer(_local_6.furniId, _local_6.position));
                    break;
                case RoomWidgetPlayListUserActionMessage.OPEN_CATALOGUE_BUTTON_PRESSED:
                    //this._container.habboTracking.trackGoogle("playlistEditorPanelOpenCatalogue", "click");
                    break;
            }
        return null;
    }

    public get type(): string
    {
        return RoomWidgetEnum.PLAYLIST_EDITOR_WIDGET;
    }

    public get eventTypes(): string[]
    {
        return [RoomObjectSoundMachineEvent.JUKEBOX_DISPOSE];
    }

    public get messageTypes(): string[]
    {
        return [RoomWidgetFurniToWidgetMessage.REQUEST_PLAYLIST_EDITOR, RoomWidgetPlayListModificationMessage.ADD_TO_PLAYLIST, RoomWidgetPlayListModificationMessage.REMOVE_FROM_PLAYLIST, RoomWidgetPlayListPlayStateMessage.TOGGLE_PLAY_PAUSE, RoomWidgetPlayListUserActionMessage.OPEN_CATALOGUE_BUTTON_PRESSED];
    }
}
