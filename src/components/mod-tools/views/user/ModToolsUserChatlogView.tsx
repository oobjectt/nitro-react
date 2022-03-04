import { ChatRecordData, GetUserChatlogMessageComposer, UserChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { BatchUpdates, UseMessageEventHook } from '../../../../hooks';
import { ChatlogView } from '../chatlog/ChatlogView';

interface ModToolsUserChatlogViewProps
{
    userId: number;
    onCloseClick: () => void;
}

export const ModToolsUserChatlogView: FC<ModToolsUserChatlogViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;
    const [ userChatlog, setUserChatlog ] = useState<ChatRecordData[]>(null);
    const [ username, setUsername ] = useState<string>(null);
    
    const onModtoolUserChatlogEvent = useCallback((event: UserChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        BatchUpdates(() =>
        {
            setUsername(parser.data.username);
            setUserChatlog(parser.data.roomChatlogs);
        });
    }, [ userId ]);

    UseMessageEventHook(UserChatlogEvent, onModtoolUserChatlogEvent);

    useEffect(() =>
    {
        SendMessageComposer(new GetUserChatlogMessageComposer(userId));
    }, [ userId ]);

    return (
        <NitroCardView className="nitro-mod-tools-chatlog" simple>
            <NitroCardHeaderView headerText={ `User Chatlog: ${ username || '' }` } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black h-100">
                { userChatlog &&
                    <ChatlogView records={userChatlog} /> }
            </NitroCardContentView>
        </NitroCardView>
    );
}