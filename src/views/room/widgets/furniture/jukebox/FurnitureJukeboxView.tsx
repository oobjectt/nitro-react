import { GetJukeboxPlayListMessageComposer, JukeboxSongDisksMessageEvent, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../../api';
import { CreateMessageHook, SendMessageHook, useRoomEngineEvent } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureJukeboxView: FC<{}> = props =>
{
    const [objectId, setObjectId] = useState(-1);
    const { roomSession = null } = useRoomContext();

    const close = useCallback(() =>
    {
        setObjectId(-1);
    }, []);
    
    const onRoomEngineTriggerWidgetEvent = useCallback((event: RoomEngineTriggerWidgetEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR: {
                setObjectId(event.objectId);
                SendMessageHook(new GetJukeboxPlayListMessageComposer());
            }
        }
    }, []);

    const onSongDisks = useCallback((event: JukeboxSongDisksMessageEvent) =>
    {
        console.log(event)
        if(objectId === -1) return;

        const parser = event.getParser();

        console.log(event)
    }, []);
    

    CreateMessageHook(JukeboxSongDisksMessageEvent, onSongDisks);

    useRoomEngineEvent(RoomEngineTriggerWidgetEvent.REQUEST_PLAYLIST_EDITOR, onRoomEngineTriggerWidgetEvent);

    if((objectId === -1)) return null;

    return (
        <NitroCardView className="jukebox-widget" simple={ true }>
            <NitroCardHeaderView headerText={LocalizeText('playlist.editor.title')} onCloseClick={close} />
            <NitroCardContentView>
                <div className="d-flex flex-row gap-2 h-100">
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <div className="bg-success py-1 container-fluid justify-content-center d-flex rounded">
                            <h2 className="ms-4">{ LocalizeText('playlist.editor.my.music') }</h2>
                        </div>
                        <img src={GetConfiguration('image.library.url') + 'playlist/title_mymusic.gif'} alt="mymusic" className="mymusic" />
                        <div className="h-100 overflow-y-scroll">

                        </div>
                        <div className="playlistBottom text-black p-1">
                            <h5>{LocalizeText('playlist.editor.text.get.more.music')}</h5>
                            <div>{LocalizeText('playlist.editor.text.you.have.no.songdisks.available')}</div>
                            <div>{ LocalizeText('playlist.editor.text.you.can.buy.some.from.the.catalogue')}</div>
                            <button className="btn btn-primary btn-sm">{ LocalizeText('playlist.editor.button.open.catalogue')}</button>
                        </div>
                        <img src={GetConfiguration('image.library.url') + 'playlist/background_get_more_music.gif'} alt="getmore" className="getmore" />
                    </div>
                    <div className="w-50 position-relative overflow-hidden h-100 rounded">
                        <div className="bg-primary py-1 container-fluid justify-content-center d-flex rounded">
                            <h2 className="ms-4">{ LocalizeText('playlist.editor.playlist') }</h2>
                        </div>
                        <img src={GetConfiguration('image.library.url') + 'playlist/title_playlist.gif'} alt="playlist" className="playlistImg" />
                        <div className="playlistBottom text-black p-1">
                            <h5>{LocalizeText('playlist.editor.text.get.more.music')}</h5>
                            <div>{LocalizeText('playlist.editor.text.you.have.no.songdisks.available')}</div>
                            <div>{ LocalizeText('playlist.editor.text.you.can.buy.some.from.the.catalogue')}</div>
                            <button className="btn btn-primary btn-sm">{ LocalizeText('playlist.editor.button.open.catalogue')}</button>
                        </div>
                        <img src={GetConfiguration('image.library.url') + 'playlist/background_add_songs.gif'} alt="addsongs" className="getmore" />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
