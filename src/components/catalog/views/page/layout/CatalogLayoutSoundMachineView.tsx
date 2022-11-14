import { GetOfficialSongIdMessageComposer, MusicPriorities, OfficialSongIdMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetConfiguration, GetNitroInstance, LocalizeText, ProductTypeEnum, SendMessageComposer } from '../../../../../api';
import { Button, Column, Flex, Grid, LayoutImage, Text } from '../../../../../common';
import { useCatalog, useMessageEvent } from '../../../../../hooks';
import { CatalogHeaderView } from '../../catalog-header/CatalogHeaderView';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutSoundMachineView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, currentPage = null } = useCatalog();
    const [ songId, setSongId ] = useState(-1);
    const [ officialSongId, setOfficialSongId ] = useState('');

    const playPreview = (songId: number) =>
    {
        if(songId === -1) return;

        GetNitroInstance().soundManager.musicController?.playSong(songId, MusicPriorities.PRIORITY_PURCHASE_PREVIEW, 15, 0, 0, 0);
    }

    useEffect(() =>
    {
        if(!currentOffer) return

        const product = currentOffer.product;

        if(!product) return;

        if(product.extraParam.length > 0)
        {
            const id = parseInt(product.extraParam);

            if(id > 0)
            {
                setSongId(id);
            }
            else
            {
                setOfficialSongId(product.extraParam);
                SendMessageComposer(new GetOfficialSongIdMessageComposer(product.extraParam));
            }
        }
        else
        {
            setSongId(-1);
        }
        return ( GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW));
    }, [ currentOffer ]);

    useEffect(() =>
    {
        return (GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW))
    }, [])

    useMessageEvent(OfficialSongIdMessageEvent, (event: OfficialSongIdMessageEvent) =>
    {
        const parser = event.getParser();

        if(parser.officialSongId === officialSongId)
        {
            setSongId(parser.songId);
        }
    });

    return (
        <>
            <Grid>
                <Column size={ 7 } overflow="hidden">
                    { GetConfiguration('catalog.headers') &&
                        <CatalogHeaderView imageUrl={ currentPage.localization.getImage(0) }/> }
                    <CatalogItemGridWidgetView />
                </Column>
                <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                    { !currentOffer &&
                        <>
                            { !!page.localization.getImage(1) &&
                                <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                            <Text center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                        </> }
                    { currentOffer &&
                        <>
                            <Flex center overflow="hidden" style={ { height: 140 } }>
                                { (currentOffer.product.productType !== ProductTypeEnum.BADGE) &&
                                    <>
                                        <CatalogViewProductWidgetView />
                                        <CatalogAddOnBadgeWidgetView className="bg-muted rounded bottom-1 end-1" />
                                    </> }
                                { (currentOffer.product.productType === ProductTypeEnum.BADGE) && <CatalogAddOnBadgeWidgetView className="scale-2" /> }
                            </Flex>
                            <Column grow gap={ 1 }>
                                <CatalogLimitedItemWidgetView fullWidth />
                                <Text grow truncate>{ currentOffer.localizationName }</Text>
                                <Button onClick={ () => playPreview(songId) }>{ LocalizeText('play_preview_button') }</Button>
                                <Flex justifyContent="between">
                                    <Column gap={ 1 }>
                                        <CatalogSpinnerWidgetView />
                                    </Column>
                                    <CatalogTotalPriceWidget justifyContent="end" alignItems="end" />
                                </Flex>
                                <CatalogPurchaseWidgetView />
                            </Column>
                        </> }
                </Column>
            </Grid>
        </>
    );
}
