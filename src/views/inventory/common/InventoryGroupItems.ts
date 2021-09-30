import { GroupItem } from './GroupItem';

let lastGroupItems: GroupItem[] = [];

export const SetInventoryGroupItems = (groupItems: GroupItem[]) => (lastGroupItems = groupItems);

export const GetInventoryGroupItems = () => lastGroupItems;
