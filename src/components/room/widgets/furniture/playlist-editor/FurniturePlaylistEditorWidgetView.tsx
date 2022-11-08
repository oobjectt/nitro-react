import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../common';
import { useFurniturePlaylistEditorWidget } from '../../../../../hooks';
import { DiskInventoryView } from './DiskInventoryView';
import { SongPlaylistView } from './SongPlaylistView';

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
                        <DiskInventoryView />
                    </div>
                    <div className="w-50 position-relative overflow-hidden h-100 rounded d-flex flex-column">
                        <SongPlaylistView />
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
