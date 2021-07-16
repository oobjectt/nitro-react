import { ColorConverter, Nitro, NitroAdjustmentFilter, NitroContainer, NitroSprite, NitroTexture, RoomBackgroundColorEvent, RoomEngineEvent, RoomId, RoomObjectHSLColorEnabledEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomEngine } from '../../api';
import { UseMountEffect } from '../../hooks';
import { CreateEventDispatcherHook, useRoomEngineEvent } from '../../hooks/events';
import { useRoomContext } from './context/RoomContext';
import { RoomWidgetUpdateBackgroundColorPreviewEvent } from './events';
import { RoomWidgetUpdateRoomViewEvent } from './events/RoomWidgetUpdateRoomViewEvent';

export const RoomColorView: FC<{}> = props =>
{
    const [ roomBackground, setRoomBackground ] = useState<NitroSprite>(null);
    const [ roomBackgroundColor, setRoomBackgroundColor ] = useState(0);
    const [ originalRoomBackgroundColor, setOriginalRoomBackgroundColor ] = useState(0);
    const [ roomFilter, setRoomFilter ] = useState<NitroAdjustmentFilter>(null);
    const [ roomFilterColor, setRoomFilterColor ] = useState(-1);
    const { roomSession = null, canvasId = -1, eventDispatcher = null } = useRoomContext();

    const getRenderingCanvas = useCallback(() =>
    {
        return GetRoomEngine().getRoomInstanceRenderingCanvas(roomSession.roomId, canvasId);
    }, [ roomSession, canvasId ]);

    const getRoomBackground = useCallback(() =>
    {
        if(roomBackground) return roomBackground;

        const canvas = getRenderingCanvas();

        if(!canvas) return null;

        const displayObject = (canvas.master as NitroContainer);
        const background = new NitroSprite(NitroTexture.WHITE);

        displayObject.addChildAt(background, 0);

        setRoomBackground(background);

        return background;
    }, [ roomBackground, getRenderingCanvas ]);

    const updateRoomBackground = useCallback((color: number) =>
    {
        const background = getRoomBackground();

        if(!background) return;

        if(color === undefined) color = 0x000000;

        background.tint = color;
        background.width = Nitro.instance.width;
        background.height = Nitro.instance.height;
    }, [ getRoomBackground ]);

    const updateRoomBackgroundColor = useCallback((hue: number, saturation: number, lightness: number, original: boolean = false) =>
    {
        const newColor = ColorConverter.hslToRGB(((((hue & 0xFF) << 16) + ((saturation & 0xFF) << 8)) + (lightness & 0xFF)));

        setRoomBackgroundColor(newColor);
        if(original) setOriginalRoomBackgroundColor(newColor);

        const background = getRoomBackground();

        if(!background) return;

        if(!hue && !saturation && !lightness)
        {
            background.visible = false;
        }
        else
        {
            updateRoomBackground(newColor);

            background.visible = true;
        }
    }, [ getRoomBackground, updateRoomBackground ]);

    const getRoomFilter = useCallback(() =>
    {
        if(roomFilter) return roomFilter;

        const canvas = getRenderingCanvas();

        if(!canvas) return null;

        const display = canvas.master;

        if(!display) return null;

        const filter = new NitroAdjustmentFilter();

        setRoomFilter(filter);

        display.filters = [ filter ];

        return filter;
    }, [ roomFilter, getRenderingCanvas ]);

    const updateRoomFilter = useCallback((color: number) =>
    {
        const colorMatrix = getRoomFilter();

        if(!colorMatrix) return;

        const r = ((color >> 16) & 0xFF);
        const g = ((color >> 8) & 0xFF);
        const b = (color & 0xFF);

        colorMatrix.red = (r / 255);
        colorMatrix.green = (g / 255);
        colorMatrix.blue = (b / 255);
    }, [ getRoomFilter ]);

    const updateRoomFilterColor = useCallback((color: number, brightness: number) =>
    {
        const newColor = ColorConverter.hslToRGB(((ColorConverter.rgbToHSL(color) & 0xFFFF00) + brightness));

        setRoomFilterColor(newColor);
        updateRoomFilter(newColor);
    }, [ updateRoomFilter ]);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR: {
                const hslColorEvent = (event as RoomObjectHSLColorEnabledEvent);

                if(hslColorEvent.enable) updateRoomBackgroundColor(hslColorEvent.hue, hslColorEvent.saturation, hslColorEvent.lightness, true);
                else updateRoomBackgroundColor(0, 0, 0, true);

                return;
            }
            case RoomBackgroundColorEvent.ROOM_COLOR: {
                const colorEvent = (event as RoomBackgroundColorEvent);

                if(colorEvent.bgOnly) updateRoomFilterColor(0x000000, 0xFF);
                else updateRoomFilterColor(colorEvent.color, colorEvent.brightness);

                return;
            }
        }
    }, [ updateRoomBackgroundColor, updateRoomFilterColor ]);

    useRoomEngineEvent(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, onRoomEngineEvent);
    useRoomEngineEvent(RoomBackgroundColorEvent.ROOM_COLOR, onRoomEngineEvent);

    const onRoomWidgetUpdateRoomViewEvent = useCallback((event: RoomWidgetUpdateRoomViewEvent) =>
    {
        updateRoomBackground(roomBackgroundColor);
    }, [ roomBackgroundColor, updateRoomBackground ]);

    CreateEventDispatcherHook(RoomWidgetUpdateRoomViewEvent.SIZE_CHANGED, eventDispatcher, onRoomWidgetUpdateRoomViewEvent);

    const onRoomWidgetUpdateBackgroundColorPreviewEvent = useCallback((event: RoomWidgetUpdateBackgroundColorPreviewEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW: {
                updateRoomBackgroundColor(event.hue, event.saturation, event.lightness);
                return;
            }
            case RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW: {
                const color = originalRoomBackgroundColor;

                setRoomBackgroundColor(color);
                updateRoomBackground(color);
                return;
            }
        }
    }, [ originalRoomBackgroundColor, updateRoomBackgroundColor, updateRoomBackground ]);

    CreateEventDispatcherHook(RoomWidgetUpdateBackgroundColorPreviewEvent.PREVIEW, eventDispatcher, onRoomWidgetUpdateBackgroundColorPreviewEvent);
    CreateEventDispatcherHook(RoomWidgetUpdateBackgroundColorPreviewEvent.CLEAR_PREVIEW, eventDispatcher, onRoomWidgetUpdateBackgroundColorPreviewEvent);

    UseMountEffect(updateRoomBackground);

    return null;
}
