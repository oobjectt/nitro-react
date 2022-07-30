import { FC } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurniturePlaylistEditorWidget } from '../../../../hooks';

export const FurniturePlaylistEditorWidgetView: FC<{}> = props =>
{
    const { objectId = -1, onClose = null } = useFurniturePlaylistEditorWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-jukebox-widget">
            <NitroCardHeaderView headerText={ LocalizeText('playlist.editor.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="d-flex flex-row gap-2 h-100">
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <div className="bg-success py-1 container-fluid justify-content-center d-flex rounded">
                            <h2 className="ms-4">{ LocalizeText('playlist.editor.my.music') }</h2>
                        </div>
                        <img src={ GetConfiguration('image.library.url') + 'playlist/title_mymusic.gif' } className="my-music" />
                        <div className="h-100 overflow-y-scroll">

                        </div>
                        <div className="playlist-bottom text-black p-1">
                            <h5>{ LocalizeText('playlist.editor.text.get.more.music') }</h5>
                            <div>{ LocalizeText('playlist.editor.text.you.have.no.songdisks.available') }</div>
                            <div>{ LocalizeText('playlist.editor.text.you.can.buy.some.from.the.catalogue') }</div>
                            <button className="btn btn-primary btn-sm">{ LocalizeText('playlist.editor.button.open.catalogue') }</button>
                        </div>
                        <img src={ GetConfiguration('image.library.url') + 'playlist/background_get_more_music.gif' } className="get-more" />
                    </div>
                    <div className="w-50 position-relative overflow-hidden h-100 rounded">
                        <div className="bg-primary py-1 container-fluid justify-content-center d-flex rounded">
                            <h2 className="ms-4">{ LocalizeText('playlist.editor.playlist') }</h2>
                        </div>
                        <img src={ GetConfiguration('image.library.url') + 'playlist/title_playlist.gif' } className="playlist-img" />
                        <div className="playlistBottom text-black p-1">
                            <h5>{ LocalizeText('playlist.editor.text.get.more.music') }</h5>
                            <div>{ LocalizeText('playlist.editor.text.you.have.no.songdisks.available') }</div>
                            <div>{ LocalizeText('playlist.editor.text.you.can.buy.some.from.the.catalogue') }</div>
                            <button className="btn btn-primary btn-sm">{ LocalizeText('playlist.editor.button.open.catalogue') }</button>
                        </div>
                        <img src={ GetConfiguration('image.library.url') + 'playlist/background_add_songs.gif' } className="get-more" />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
