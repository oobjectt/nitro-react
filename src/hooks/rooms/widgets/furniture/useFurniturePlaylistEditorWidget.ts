import { AddJukeboxDiskComposer, FurnitureMultiStateComposer, GetJukeboxPlayListMessageComposer, JukeboxSongDisksMessageEvent, RemoveJukeboxDiskComposer, RoomControllerLevel, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const useFurniturePlaylistEditorWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const { roomSession = null } = useRoom();

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
        }
        else
        {
            if(roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator)
            {
                SendMessageComposer(new FurnitureMultiStateComposer(event.objectId, -2));
            }
        }

        setObjectId(event.objectId);
        setCategory(event.category);

        SendMessageComposer(new GetJukeboxPlayListMessageComposer());
    });

    useMessageEvent<JukeboxSongDisksMessageEvent>(JukeboxSongDisksMessageEvent, event =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();

        console.log(parser);
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, onClose, addToPlaylist, removeFromPlaylist, togglePlayPause, openCatalogButtonPressed };
}

export const useFurniturePlaylistEditorWidget = useFurniturePlaylistEditorWidgetState;
