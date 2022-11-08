import { IAdvancedMap } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetConfiguration, GetNitroInstance, LocalizeText } from '../../../../../api';
import { AutoGrid, LayoutGridItem } from '../../../../../common';

export interface DiskInventoryViewProps
{
    diskInventory: IAdvancedMap<number, number>;
    addToPlaylist(diskId: number, slotNumber: number): void;
}
export const DiskInventoryView: FC<DiskInventoryViewProps> = props =>
{
    const { diskInventory = null, addToPlaylist = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<number>(-1);

    return (<>
        <div className="bg-success py-3 container-fluid justify-content-center d-flex rounded">
            <img src={ GetConfiguration('image.library.url') + 'playlist/title_mymusic.gif' } className="my-music" />
            <h2 className="ms-4">{ LocalizeText('playlist.editor.my.music') }</h2>
        </div>
        <div className="h-100 overflow-y-scroll mt-4">
            <AutoGrid columnCount={ 5 }>
                { diskInventory && diskInventory.getKeys().map( (key, index) =>
                {
                    const diskId = diskInventory.getKey(index);
                    const songId = diskInventory.getWithIndex(index);
                    const songData = GetNitroInstance().soundManager.musicController?.getSongInfo(songId);

                    return (
                        <LayoutGridItem key={ index } itemActive={ selectedItem === index } onClick={ () => setSelectedItem(prev => prev === index ? -1 : index) } classNames={ [ 'text-black' ] }>
                            <div className="disk-image">
                                { songData?.name }
                                { (selectedItem === index) &&
                                    <><button onClick={ () => addToPlaylist(diskId, GetNitroInstance().soundManager.musicController?.getRoomItemPlaylist()?.length) }>Add</button></>
                                }
                            </div>
                        </LayoutGridItem>)
                }) }
            </AutoGrid>
        </div>
        <div className="playlist-bottom text-black p-1">
            <h5>{ LocalizeText('playlist.editor.text.get.more.music') }</h5>
            <div>{ LocalizeText('playlist.editor.text.you.have.no.songdisks.available') }</div>
            <div>{ LocalizeText('playlist.editor.text.you.can.buy.some.from.the.catalogue') }</div>
            <button className="btn btn-primary btn-sm">{ LocalizeText('playlist.editor.button.open.catalogue') }</button>
        </div>
        <img src={ GetConfiguration('image.library.url') + 'playlist/background_get_more_music.gif' } className="get-more" />
    </>);
}
