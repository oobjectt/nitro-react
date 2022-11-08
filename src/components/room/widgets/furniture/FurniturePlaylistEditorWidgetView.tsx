import { FC } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurniturePlaylistEditorWidget } from '../../../../hooks';

export const FurniturePlaylistEditorWidgetView: FC<{}> = props =>
{
    const { objectId = -1, onClose = null } = useFurniturePlaylistEditorWidget();

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-playlist-editor-widget">
            <NitroCardHeaderView headerText={ LocalizeText('playlist.editor.title') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="d-flex flex-row gap-2 h-100">
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <div className="bg-success py-3 container-fluid justify-content-center d-flex rounded">
                            <img src={ GetConfiguration('image.library.url') + 'playlist/title_mymusic.gif' } className="my-music" />
                            <h2 className="ms-4">{ LocalizeText('playlist.editor.my.music') }</h2>
                        </div>
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
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <div className="bg-primary py-3 container-fluid justify-content-center d-flex rounded">
                            <img src={ GetConfiguration('image.library.url') + 'playlist/title_playlist.gif' } className="playlist-img" />
                            <h2 className="ms-4">{ LocalizeText('playlist.editor.playlist') }</h2>
                        </div>
                        <div className="h-100 overflow-y-scroll">
                        </div>
                        <div className="playlist-bottom text-black p-1 ms-5">
                            <h5>{ LocalizeText('playlist.editor.add.songs.to.your.playlist') }</h5>
                            <div>{ LocalizeText('playlist.editor.text.click.song.to.choose.click.again.to.move') }</div>
                        </div>
                        <img src={ GetConfiguration('image.library.url') + 'playlist/background_add_songs.gif' } className="add-songs" />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
