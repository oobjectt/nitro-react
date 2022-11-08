import { FC, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../../api';
import { AutoGrid, LayoutGridItem } from '../../../../../common';
import { useFurniturePlaylistEditorWidget } from '../../../../../hooks';

export const SongPlaylistView: FC<{}> = props =>
{
    const { playlist = null, removeFromPlaylist = null, togglePlayPause = null, objectId = -1 } = useFurniturePlaylistEditorWidget();
    const [ selectedItem, setSelectedItem ] = useState<number>(-1);

    return (<>
        <div className="bg-primary py-3 container-fluid justify-content-center d-flex rounded">
            <img src={ GetConfiguration('image.library.url') + 'playlist/title_playlist.gif' } className="playlist-img" />
            <h2 className="ms-4">{ LocalizeText('playlist.editor.playlist') }</h2>
        </div>
        <div className="h-100 overflow-y-scroll">
            <AutoGrid columnCount={ 5 }>
                { playlist && playlist.map( (songInfo, index) =>
                {
                    return (
                        <LayoutGridItem key={ index } itemActive={ selectedItem === index } onClick={ () => setSelectedItem(prev => prev === index ? -1 : index) } classNames={ [ 'text-black' ] }>
                            <div className="disk-image">
                                { songInfo.name }
                                { (selectedItem === index) &&
                                    <><button onClick={ () => removeFromPlaylist(index) }>Remove</button></>
                                }
                            </div>
                        </LayoutGridItem>)
                }) }
            </AutoGrid>
        </div>
        { (!playlist || playlist.length === 0 ) &&
        <><div className="playlist-bottom text-black p-1 ms-5">
            <h5>{ LocalizeText('playlist.editor.add.songs.to.your.playlist') }</h5>
            <div>{ LocalizeText('playlist.editor.text.click.song.to.choose.click.again.to.move') }</div>
        </div>
        <img src={ GetConfiguration('image.library.url') + 'playlist/background_add_songs.gif' } className="add-songs" /></>
        }
        { (playlist && playlist.length > 0) &&
            <button onClick={ () => togglePlayPause(objectId, selectedItem !== -1 ? selectedItem : 0 ) }>Play/Pause</button>
        }

    </>);
}
