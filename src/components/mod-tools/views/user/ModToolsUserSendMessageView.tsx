import { ModMessageMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { NotificationAlertEvent } from '../../../../events';
import { DispatchUiEvent } from '../../../../hooks';
import { ISelectedUser } from '../../common/ISelectedUser';
import { useModToolsContext } from '../../ModToolsContext';

interface ModToolsUserSendMessageViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
    offsetTop?: number;
}

export const ModToolsUserSendMessageView: FC<ModToolsUserSendMessageViewProps> = props =>
{
    const { user = null, onCloseClick = null, offsetTop = 0 } = props;
    const [ message, setMessage ] = useState('');
    
    const { modToolsState } = useModToolsContext();

    const sendMessage = useCallback(() =>
    {
        if(message.trim().length === 0)
        {
            DispatchUiEvent(new NotificationAlertEvent([ 'Please write a message to user.' ], null, null, null, 'Error', null));
            
            return;
        }

        SendMessageComposer(new ModMessageMessageComposer(user.userId, message, -999));

        onCloseClick();
    }, [ message, user, onCloseClick ]);

    if(!user) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-message" theme="primary-slim" windowPosition={DraggableWindowPosition.TOP_LEFT} offsetTop={ offsetTop }>
            <NitroCardHeaderView headerText={ LocalizeText('modtools.header.send.message') } onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Text>{ LocalizeText('modtools.message.to',['username'],[user.username]) }</Text>
                <select className="form-select form-select-sm" onChange={(e) => setMessage(e.target.value)}>
                    <option disabled selected>{ LocalizeText('modtools.templates') }</option>
                    { modToolsState.settings.messageTemplates.map(el =>
                    {
                        return <option value={ el }>{ el }</option>
                     })
                    }
                </select>
                <textarea className="form-control" value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Button fullWidth onClick={ sendMessage }>{ LocalizeText('modtools.send.message') }</Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
