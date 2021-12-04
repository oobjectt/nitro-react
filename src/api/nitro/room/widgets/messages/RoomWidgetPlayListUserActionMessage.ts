import { RoomWidgetMessage } from '.';

export class RoomWidgetPlayListUserActionMessage extends RoomWidgetMessage
{
    public static readonly OPEN_CATALOGUE_BUTTON_PRESSED = 'RWPLUA_OPEN_CATALOGUE_BUTTON_PRESSED';

    constructor()
    {
        super(RoomWidgetPlayListUserActionMessage.OPEN_CATALOGUE_BUTTON_PRESSED);
    }
}
