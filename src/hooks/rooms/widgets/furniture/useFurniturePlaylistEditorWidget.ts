import { AddJukeboxDiskComposer, AdvancedMap, FurnitureListAddOrUpdateEvent, FurnitureListEvent, FurnitureListRemovedEvent, FurnitureMultiStateComposer, IAdvancedMap, IMessageEvent, ISongInfo, NotifyPlayedSongEvent, NowPlayingEvent, PlayListStatusEvent, RemoveJukeboxDiskComposer, RoomControllerLevel, RoomEngineTriggerWidgetEvent, SongDiskInventoryReceivedEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetNitroInstance, GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, LocalizeText, NotificationBubbleType, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent, useSoundEvent } from '../../../events';
import { useNotification } from '../../../notification';
import { useFurniRemovedEvent } from '../../engine';
import { useRoom } from '../../useRoom';

const DISK_COLOR_RED_MIN:number = 130;
const DISK_COLOR_RED_RANGE:number = 100;
const DISK_COLOR_GREEN_MIN:number = 130;
const DISK_COLOR_GREEN_RANGE:number = 100;
const DISK_COLOR_BLUE_MIN:number = 130;
const DISK_COLOR_BLUE_RANGE:number = 100;

const useFurniturePlaylistEditorWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ diskInventory, setDiskInventory ] = useState<IAdvancedMap<number, number>>(new AdvancedMap());
    const [ playlist, setPlaylist ] = useState<ISongInfo[]>([]);
    const { roomSession = null } = useRoom();
    const { showSingleBubble = null } = useNotification();

    const onClose = () =>
    {
        setObjectId(-1);
        setCategory(-1);
    }

    const addToPlaylist = (diskId: number, slotNumber: number) => SendMessageComposer(new AddJukeboxDiskComposer(diskId, slotNumber));

    const removeFromPlaylist = (slotNumber: number) => SendMessageComposer(new RemoveJukeboxDiskComposer(slotNumber));

    const togglePlayPause = (furniId: number, position: number) =>
    {
        SendMessageComposer(new FurnitureMultiStateComposer(furniId, position));
    }

    const openCatalogButtonPressed = () =>
    {}

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        if(!roomObject) return;
        console.log(event);

        if(IsOwnerOfFurniture(roomObject))
        {
            // show the editor
            setObjectId(event.objectId);
            setCategory(event.category);

            GetNitroInstance().soundManager.musicController?.requestUserSongDisks();
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

    const getDiskColour = (k:string): string => 
    {
        var _local_2:number = 0;
        var _local_3:number = 0;
        var _local_4:number = 0;
        var _local_5:number = 0;

        while (_local_5 < k.length)
        {
            switch ((_local_5 % 3))
            {
                case 0:
                    _local_2 = (_local_2 + ( k.charCodeAt(_local_5) * 37) );
                    break;
                case 1:
                    _local_3 = (_local_3 + ( k.charCodeAt(_local_5) * 37) );
                    break;
                case 2:
                    _local_4 = (_local_4 + ( k.charCodeAt(_local_5) * 37) );
                    break;
            }
            _local_5++;
        }

        _local_2 = ((_local_2 % DISK_COLOR_RED_RANGE) + DISK_COLOR_RED_MIN);
        _local_3 = ((_local_3 % DISK_COLOR_GREEN_RANGE) + DISK_COLOR_GREEN_MIN);
        _local_4 = ((_local_4 % DISK_COLOR_BLUE_RANGE) + DISK_COLOR_BLUE_MIN);

        return `rgb(${ _local_2 },${ _local_3 },${ _local_4 })`;
    }



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

    useSoundEvent<SongDiskInventoryReceivedEvent>(SongDiskInventoryReceivedEvent.SDIR_SONG_DISK_INVENTORY_RECEIVENT_EVENT, event =>
    {
        setDiskInventory(GetNitroInstance().soundManager.musicController?.songDiskInventory.clone());
    });

    useSoundEvent<PlayListStatusEvent>(PlayListStatusEvent.PLUE_PLAY_LIST_UPDATED, event =>
    {
        setPlaylist(GetNitroInstance().soundManager.musicController?.getRoomItemPlaylist()?.entries.concat())
    });

    const onFurniListUpdated = (event : IMessageEvent) =>
    {
        console.log(event);
        if(event instanceof FurnitureListEvent)
        {
            if(event.getParser().fragmentNumber === 0)
            {
                GetNitroInstance().soundManager.musicController?.requestUserSongDisks();
            }
        }
        else
        {
            GetNitroInstance().soundManager.musicController?.requestUserSongDisks();
        }
    }

    useMessageEvent(FurnitureListEvent, onFurniListUpdated);
    useMessageEvent(FurnitureListRemovedEvent, onFurniListUpdated);
    useMessageEvent(FurnitureListAddOrUpdateEvent, onFurniListUpdated);

    return { objectId, diskInventory, playlist, onClose, addToPlaylist, removeFromPlaylist, togglePlayPause, openCatalogButtonPressed, getDiskColour };
}

export const useFurniturePlaylistEditorWidget = useFurniturePlaylistEditorWidgetState;
