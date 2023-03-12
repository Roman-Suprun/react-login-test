export interface IDayInMonth {
    id: string
    text: string
}

export type TDaysInMonth = IDayInMonth[]

export type TListItem = {
    id: string
    isFixed?: boolean
    content: string
}
export type TList = TListItem[]

export interface ITaskItem {
    id: string
    date: string
    list: TList
}

export interface ITaskDataObject {
    [key: string]: ITaskItem
}

export interface IPublicHoliday {
    counties: null
    countryCode: string
    date: string
    fixed: boolean
    global: boolean
    launchYear: string
    localName: string
    name: string
}

export type TPublicHolidays = IPublicHoliday[]