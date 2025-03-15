export interface AbonInfo {
    'Номер договора': number
    'ФИО': string
    'Адрес': string
    'Долг.Аванс': number
    'ID Тарифа': number
    'Услуга': string
    'Сумма начисления': number
    'Перерасчет': number
    'Итоговая сумма': number
    template: string
}

export interface HouseInfo {
    "idIntercom?": number
    "flat_number": string
    "hasIntercom": boolean
    "hasTv": boolean
    "full_name": string
    "idTV?": number
}