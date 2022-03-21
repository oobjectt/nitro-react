import { GetModeratorRoomInfoMessageComposer, ModerateRoomMessageComposer, ModeratorActionMessageComposer, ModeratorRoomInfoEvent } from '@nitrots/nitro-renderer';
import { FC, LegacyRef, useCallback, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer, TryVisitRoom } from '../../../../api';
import { Button, Column, DraggableWindowPosition, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { ModToolsOpenRoomChatlogEvent } from '../../../../events/mod-tools/ModToolsOpenRoomChatlogEvent';
import { BatchUpdates, DispatchUiEvent, UseMessageEventHook } from '../../../../hooks';
import { useModToolsContext } from '../../ModToolsContext';

interface ModToolsRoomViewProps<T = HTMLDivElement>
{
    innerRef?: LegacyRef<T>;
    roomId: number;
    onCloseClick: () => void;
    offsetLeft?: number;
    offsetTop?: number;
}

export const ModToolsRoomView: FC<ModToolsRoomViewProps> = props =>
{
    const { innerRef = null, roomId = null, onCloseClick = null, offsetLeft = 0, offsetTop = 0 } = props;

    const [ infoRequested, setInfoRequested ] = useState(false);
    const [ loadedRoomId, setLoadedRoomId ] = useState(null);

    const [ name, setName ] = useState(null);
    const [ ownerId, setOwnerId ] = useState(null);
    const [ ownerName, setOwnerName ] = useState(null);
    const [ ownerInRoom, setOwnerInRoom ] = useState(false);
    const [ usersInRoom, setUsersInRoom ] = useState(0);

    //form data
    const [ kickUsers, setKickUsers ] = useState(false);
    const [ lockRoom, setLockRoom ] = useState(false);
    const [ changeRoomName, setChangeRoomName ] = useState(false);
    const [ message, setMessage ] = useState('');
    
    const { modToolsState } = useModToolsContext();

    const onModtoolRoomInfoEvent = useCallback((event: ModeratorRoomInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.flatId !== roomId) return;

        BatchUpdates(() =>
        {
            setLoadedRoomId(parser.data.flatId);
            setName(parser.data.room.name);
            setOwnerId(parser.data.ownerId);
            setOwnerName(parser.data.ownerName);
            setOwnerInRoom(parser.data.ownerInRoom);
            setUsersInRoom(parser.data.userCount);
        });
    }, [ roomId ]);

    UseMessageEventHook(ModeratorRoomInfoEvent, onModtoolRoomInfoEvent);

    const handleClick = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'alert_only':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_ALERT, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
            case 'send_message':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_MESSAGE, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
        }
    }, [ changeRoomName, kickUsers, lockRoom, message, roomId ]);

    useEffect(() =>
    {
        if(infoRequested) return;
        
        SendMessageComposer(new GetModeratorRoomInfoMessageComposer(roomId));
        setInfoRequested(true);
    }, [ roomId, infoRequested, setInfoRequested ]);

    return (
        <NitroCardView className="nitro-mod-tools-room" theme="primary-slim" windowPosition={DraggableWindowPosition.TOP_LEFT} offsetLeft={ offsetLeft } offsetTop={ offsetTop } innerRef={ innerRef } >
            <NitroCardHeaderView headerText={ LocalizeText('modtools.header.room',['room'],[name]) } onCloseClick={ event => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Flex gap={ 2 }>
                    <Column justifyContent="center" grow gap={ 1 }>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text bold align="end" className="col-7">{ LocalizeText('modtools.rooms.owner') }</Text>
                            <Text underline pointer truncate>{ ownerName }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text bold align="end" className="col-7">{ LocalizeText('modtools.rooms.users') }</Text>
                            <Text>{ usersInRoom }</Text>
                        </Flex>
                        <Flex alignItems="center" gap={ 2 }>
                            <Text bold align="end" className="col-7">{ LocalizeText('modtools.rooms.owner.in') }</Text>
                            <Text>{ ownerInRoom ? LocalizeText('generic.yes') : LocalizeText('generic.no') }</Text>
                        </Flex>
                    </Column>
                    <Column gap={ 1 }>
                        <Button onClick={event => TryVisitRoom(roomId)}>{ LocalizeText('modtools.rooms.visit') }</Button>
                        <Button onClick={ event => DispatchUiEvent(new ModToolsOpenRoomChatlogEvent(roomId)) }>{ LocalizeText('modtools.rooms.chatlog') }</Button>
                    </Column>
                </Flex>
                <Column className="bg-muted rounded p-2" gap={ 1 }>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ kickUsers } onChange={ event => setKickUsers(event.target.checked) } />
                        <Text small>{ LocalizeText('modtools.rooms.kick') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ lockRoom } onChange={ event => setLockRoom(event.target.checked) } />
                        <Text small>{ LocalizeText('modtools.rooms.doorbell') }</Text>
                    </Flex>
                    <Flex alignItems="center" gap={ 1 }>
                        <input className="form-check-input" type="checkbox" checked={ changeRoomName } onChange={ event => setChangeRoomName(event.target.checked) }/>
                        <Text small>{ LocalizeText('modtools.rooms.change.name') }</Text>
                    </Flex>
                </Column>
                <select className="form-select form-select-sm" onChange={(e) => setMessage(e.target.value)}>
                    <option disabled selected>{ LocalizeText('modtools.templates') }</option>
                    { modToolsState.settings.roomMessageTemplates.map(el =>
                    {
                        return <option value={ el }>{ el }</option>
                     })
                    }
                </select>
                <textarea className="form-control" placeholder={ LocalizeText('modtools.rooms.message') } value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Flex justifyContent="between">
                    <Button variant="danger" onClick={ event => handleClick('send_message') }>{ LocalizeText('modtools.rooms.caution') }</Button>
                    <Button onClick={ event => handleClick('alert_only') }>{ LocalizeText('modtools.rooms.alert') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
