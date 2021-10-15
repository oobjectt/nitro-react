import { IFurnitureData } from '@nitrots/nitro-renderer/src/nitro/session/furniture/IFurnitureData';

export class CraftingFurnitureItem
{
    private _productCode: string;
    private _furnitureData: IFurnitureData;
    private _inventoryIds: number[];
    private _mixerIds: number[];

    constructor(k: string, _arg_2: IFurnitureData)
    {
        this._productCode = k;
        this._furnitureData = _arg_2;
        this._inventoryIds = [];
        this._mixerIds = [];
    }

    public get furnitureData(): IFurnitureData
    {
        return this._furnitureData;
    }

    public get productCode(): string
    {
        return this._productCode;
    }

    public get typeId(): number
    {
        return (this._furnitureData) ? this._furnitureData.id : -1;
    }

    public get countInInventory(): number
    {
        return (this._inventoryIds) ? this._inventoryIds.length : 0;
    }

    public set inventoryIds(k: number[])
    {
        this._inventoryIds = k;
    }

    public getItemToMixer(): number
    {
        if(this.countInInventory === 0)
        {
            return 0;
        }
        var k = this._inventoryIds.shift();
        this._mixerIds.push(k);
        return k;
    }

    public returnItemToInventory(k: number): void
    {
        this._inventoryIds.push(k);
        this._mixerIds.splice(this._mixerIds.indexOf(k), 1);
    }
}
