import { AddJukeboxDiskComposer, FurnitureMultiStateComposer, NotifyPlayedSongEvent, NowPlayingEvent, RemoveJukeboxDiskComposer, RoomControllerLevel, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetNitroInstance, GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, LocalizeText, NotificationBubbleType, SendMessageComposer } from '../../../../api';
import { useRoomEngineEvent, useSoundEvent } from '../../../events';
import { useNotification } from '../../../notification';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const useFurniturePlaylistEditorWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const { roomSession = null } = useRoom();
    const { showSingleBubble = null } = useNotification();

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
    }

    const addToPlaylist = (diskId: number, slotNumber: number) => SendMessageComposer(new AddJukeboxDiskComposer(diskId, slotNumber));

    const removeFromPlaylist = (slotNumber: number) => SendMessageComposer(new RemoveJukeboxDiskComposer(slotNumber));

    const togglePlayPause = (furniId: number, position: number) => SendMessageComposer(new FurnitureMultiStateComposer(furniId, position));

    const openCatalogButtonPressed = () =>
    {}

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;

        if(IsOwnerOfFurniture(roomObject))
        {
            // show the editor
            setObjectId(event.objectId);
            setCategory(event.category);

            GetNitroInstance().soundManager.musicController?.getRoomItemPlaylist()?.requestPlayList();
        }
        else
        {
            if(roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator)
            {
                SendMessageComposer(new FurnitureMultiStateComposer(event.objectId, -2));
            }
        }
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    useSoundEvent<NowPlayingEvent>(NowPlayingEvent.NPE_SONG_CHANGED, event =>
    {

    });

    useSoundEvent<NowPlayingEvent>(NowPlayingEvent.NPE_USER_PLAY_SONG, event =>
    {

    });

    useSoundEvent<NotifyPlayedSongEvent>(NotifyPlayedSongEvent.NOTIFY_PLAYED_SONG, event =>
    {
        showSingleBubble(LocalizeText('soundmachine.notification.playing', [ 'songname', 'songauthor' ], [ event.name, event.creator ]), NotificationBubbleType.SOUNDMACHINE)
    });

    return { objectId, onClose, addToPlaylist, removeFromPlaylist, togglePlayPause, openCatalogButtonPressed };
}

export const useFurniturePlaylistEditorWidget = useFurniturePlaylistEditorWidgetState;
