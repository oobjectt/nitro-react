import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../../common';
import { Flex } from '../../../../common/Flex';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendBarItemView } from './FriendBarItemView';

interface FriendBarViewProps
{
    onlineFriends: MessengerFriend[];
}

export const FriendBarView: FC<FriendBarViewProps> = props =>
{
    const { onlineFriends = null } = props;

    const [indexOffset, setIndexOffset] = useState(0);
    const [maxDisplayCount, setMaxDisplayCount] = useState(0);

    const friendWidth = 200;
    const friendRef = useRef<HTMLDivElement>();

    const canDecreaseIndex = useMemo(() =>
    {
        if(indexOffset === 0) return false;

        return true;
    }, [indexOffset]);

    const canIncreaseIndex = useMemo(() =>
    {
        if((onlineFriends.length <= maxDisplayCount) || (indexOffset === (onlineFriends.length - 1))) return false;

        return true;
    }, [maxDisplayCount, indexOffset, onlineFriends]);

    const checkOverflow = useCallback(() =>
    {
        const elemWidth = friendRef.current.parentElement.getBoundingClientRect().width + friendWidth;
        const parentWidth = friendRef.current.parentElement.parentElement.clientWidth;
        console.log(elemWidth, parentWidth)
        return elemWidth > parentWidth
    }, [friendRef]);

    const calculateDisplayCount = useCallback(() =>
    {
        for(let i = 0; i <= 30; i++)
        {
            setMaxDisplayCount(i);
            if(checkOverflow()) return;
        }
    }, [checkOverflow])

    useEffect(() =>
    {
        if(!friendRef.current) return;
        
        setMaxDisplayCount(1)

        const resizeObserver = new ResizeObserver(() =>
        {
            calculateDisplayCount();
            resizeObserver.disconnect();
        });
        
        resizeObserver.observe(friendRef.current);

        window.addEventListener('resize', () => { calculateDisplayCount() });
        
        return () =>
        {
            resizeObserver.disconnect();
            window.removeEventListener('resize', () => { calculateDisplayCount() });
            
        }
    }, [calculateDisplayCount]);

    return (
        <Flex alignItems="center" shrink={false} className="friend-bar" innerRef={friendRef}>
            <Button variant="black" className="friend-bar-button" disabled={!canDecreaseIndex} onClick={event => setIndexOffset(indexOffset - 1)}>
                <FontAwesomeIcon icon="chevron-left" />
            </Button>
            {Array.from(Array(maxDisplayCount), (e, i) =>
            {
                return <FriendBarItemView key={i} friend={(onlineFriends[indexOffset + i] || null)} />;
            })}
            <Button variant="black" className="friend-bar-button" disabled={!canIncreaseIndex} onClick={event => setIndexOffset(indexOffset + 1)}>
                <FontAwesomeIcon icon="chevron-right" />
            </Button>
        </Flex>
    );
}
