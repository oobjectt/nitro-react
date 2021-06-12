import { NavigatorInitComposer, NavigatorSearchComposer, RoomSessionEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { NavigatorEvent } from '../../events';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { useUiEvent } from '../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../hooks/messages/message-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { NavigatorContextProvider } from './context/NavigatorContext';
import { NavigatorMessageHandler } from './NavigatorMessageHandler';
import { NavigatorViewProps } from './NavigatorView.types';
import { initialNavigator, NavigatorActions, NavigatorReducer } from './reducers/NavigatorReducer';
import { NavigatorSearchResultSetView } from './views/search-result-set/NavigatorSearchResultSetView';
import { NavigatorSearchView } from './views/search/NavigatorSearchView';

export const NavigatorView: FC<NavigatorViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ isCreatorOpen, setCreatorOpen ] = useState(false);
    const [ navigatorState, dispatchNavigatorState ] = useReducer(NavigatorReducer, initialNavigator);
    const { needsNavigatorUpdate = false, topLevelContext = null, topLevelContexts = null } = navigatorState;

    const onNavigatorEvent = useCallback((event: NavigatorEvent) =>
    {
        switch(event.type)
        {
            case NavigatorEvent.SHOW_NAVIGATOR:
                setIsVisible(true);
                return;
            case NavigatorEvent.HIDE_NAVIGATOR:
                setIsVisible(false);
                return;
            case NavigatorEvent.TOGGLE_NAVIGATOR:
                setIsVisible(value => !value);
                return;
        }
    }, []);

    useUiEvent(NavigatorEvent.SHOW_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.HIDE_NAVIGATOR, onNavigatorEvent);
    useUiEvent(NavigatorEvent.TOGGLE_NAVIGATOR, onNavigatorEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setIsVisible(false);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);

    const sendSearch = useCallback((searchValue: string, contextCode: string) =>
    {
        SendMessageHook(new NavigatorSearchComposer(contextCode, searchValue));
    }, []);

    useEffect(() =>
    {
        if(!isVisible || !needsNavigatorUpdate) return;
        
        dispatchNavigatorState({
            type: NavigatorActions.SET_NEEDS_UPDATE,
            payload: {
                flag: false
            }
        });
        
        SendMessageHook(new NavigatorInitComposer());
    }, [ isVisible, needsNavigatorUpdate ]);

    useEffect(() =>
    {
        if(!topLevelContexts || !topLevelContexts.length) return;

        sendSearch('', topLevelContexts[0].code);
    }, [ topLevelContexts, sendSearch ]);

    return (
        <NavigatorContextProvider value={ { navigatorState, dispatchNavigatorState } }>
            <NavigatorMessageHandler />
            { isVisible &&
                <NitroCardView className="nitro-navigator">
                    <NitroCardHeaderView headerText={ LocalizeText('navigator.title') } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardTabsView>
                        { topLevelContexts.map((context, index) =>
                            {
                                return (
                                    <NitroCardTabsItemView key={ index } isActive={ ((topLevelContext === context) && !isCreatorOpen) } onClick={ event => sendSearch('', context.code) }>
                                        { LocalizeText(('navigator.toplevelview.' + context.code)) }
                                    </NitroCardTabsItemView>
                                );
                            }) }
                        <NitroCardTabsItemView>
                            
                        </NitroCardTabsItemView>
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        <NavigatorSearchView sendSearch={ sendSearch } />
                        <NavigatorSearchResultSetView />
                    </NitroCardContentView>
                </NitroCardView> }
        </NavigatorContextProvider>
    );
}
