import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardAccordionSetView, NitroLayoutButton, NitroLayoutFlex } from '../../../../layout';
import { useFriendsContext } from '../../context/FriendsContext';
import { FriendsRequestItemView } from '../friends-request-item/FriendsRequestItemView';
import { FriendsRequestViewProps } from './FriendsRequestView.types';

export const FriendsRequestView: FC<FriendsRequestViewProps> = props =>
{
    const { requests = [] } = props;
    const { declineFriend = null } = useFriendsContext();

    if(!requests.length) return null;

    return (
        <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${ requests.length })` } isExpanded={ true }>
            { requests.map((request, index) =>
                {
                    return <FriendsRequestItemView key={ index } request={ request } />
                }) }
            <NitroLayoutFlex className="justify-content-center p-1">
                <NitroLayoutButton size="sm" onClick={ event => declineFriend(-1, true) }>
                    { LocalizeText('friendlist.requests.dismissall') }
                </NitroLayoutButton>
            </NitroLayoutFlex>
        </NitroCardAccordionSetView>
    );
}
