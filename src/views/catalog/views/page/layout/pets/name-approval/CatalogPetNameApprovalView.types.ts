import { Dispatch, SetStateAction } from 'react';

export interface CatalogPetNameApprovalViewProps
{
    petNameValue: string;
    setPetNameValue: Dispatch<SetStateAction<string>>;
}
