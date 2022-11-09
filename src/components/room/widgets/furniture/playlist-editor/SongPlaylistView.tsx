import { ISongInfo } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../../api';
import { Base, Button, Flex } from '../../../../../common';

export interface SongPlaylistViewProps
{
    furniId: number;
    playlist: ISongInfo[];
    removeFromPlaylist(slotNumber: number): void;
    togglePlayPause(furniId: number, position: number): void;
    getDiskColour: (k: string) => string;
}

export const SongPlaylistView: FC<SongPlaylistViewProps> = props =>
{
    const { furniId = -1, playlist = null, removeFromPlaylist = null, togglePlayPause = null, getDiskColour = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<number>(-1);


    const action = (index) => 
    {
        if(selectedItem === index) removeFromPlaylist(index);
        else 
        {

        }
    }


    return (<>
        <div className="bg-primary py-3 container-fluid justify-content-center d-flex rounded">
            <img src={ GetConfiguration('image.library.url') + 'playlist/title_playlist.gif' } className="playlist-img" />
            <h2 className="ms-4">{ LocalizeText('playlist.editor.playlist') }</h2>
        </div>
        <div className="h-100 overflow-y-scroll py-2">
            <Flex column gap={ 2 }>
                { playlist && playlist.map( (songInfo, index) =>
                {
                    return <Flex gap={ 1 } key={ index } className={ 'text-black cursor-pointer ' + (selectedItem === index ? 'border border-muted border-2 rounded' : 'border-2') } alignItems="center" onClick={ () => setSelectedItem(prev => prev === index ? -1 : index) }>
                        <Base onClick={ () => action(index) } className={ 'disk-2 ' + (selectedItem === index ? 'selected-song' : '') } style={ { backgroundColor: (selectedItem === index ? '' : getDiskColour(songInfo.songData)) } }/>
                        { songInfo.name }
                    </Flex>
                }) }

            </Flex>
            { /* <AutoGrid columnCount={ 5 }>
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
            </AutoGrid> */ }
        </div>
        { (!playlist || playlist.length === 0 ) &&
        <><div className="playlist-bottom text-black p-1 ms-5">
            <h5>{ LocalizeText('playlist.editor.add.songs.to.your.playlist') }</h5>
            <div>{ LocalizeText('playlist.editor.text.click.song.to.choose.click.again.to.move') }</div>
        </div>
        <img src={ GetConfiguration('image.library.url') + 'playlist/background_add_songs.gif' } className="add-songs" /></>
        }
        { (playlist && playlist.length > 0) &&
            <Button variant="success" size="lg" onClick={ () => togglePlayPause(furniId, selectedItem !== -1 ? selectedItem : 0 ) }>{ LocalizeText('playlist.editor.button.play.now') }</Button>
        }

    </>);
}
