import { cloneDeep } from 'lodash';

export const CardTypeEnum = {
    CHINESE: 'English <-> Chinese',
    FRENCH: 'English <-> French',
    SPANISH: 'English <-> Spanish',
    CUSTOM: 'Custom',
};

export const SideType = {
    chinese: [
        { label: 'English', value: '' },
        { label: 'Chinese Characters', value: '' },
        { label: 'Pinyin', value: '' }
    ],
    french: [
        { label: 'English', value: '' },
        { label: 'French', value: '' },
    ],
    spanish: [
        { label: 'English', value: '' },
        { label: 'Spanish', value: '' },
    ],
    custom: [
        { label: 'front', value: '' },
        { label: 'back', value: '' },
    ],
};

export const CardTypeToCardInfo = {
    chinese: {
        cardType: CardTypeEnum.CHINESE,
        sideType: SideType.chinese,
    },
    french: {
        cardType: CardTypeEnum.FRENCH,
        sideType: SideType.french,
    },
    spanish: {
        cardType: CardTypeEnum.SPANISH,
        sideType: SideType.spanish,
    },
    custom: {
        cardType: CardTypeEnum.CUSTOM,
        sideType: SideType.custom
    },
};

export function getCardInfo(cardTypeEnum) {
    let theCardInfo = cloneDeep(CardTypeToCardInfo.custom);
    for (let [key, cardInfo] of Object.entries(CardTypeToCardInfo)) {
        if (cardInfo.cardType == cardTypeEnum) {
            theCardInfo = cloneDeep(cardInfo);
            break;
        }
    }

    return theCardInfo
}