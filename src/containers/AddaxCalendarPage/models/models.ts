import {DraggableLocation} from "react-beautiful-dnd";

export type TListItem = {
    id: string
    isFixed: boolean
    content: string
}
export type TList = TListItem[]

export interface IDayInMonth {
    id: string
    text: string
    date: string
    list: TList
}

export type TDaysInMonth = IDayInMonth[]

export type TCalendarData = {[ket: string]: TDaysInMonth}

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

export type TOnDrug = {
    source: DraggableLocation
    destination: DraggableLocation
    daysInMonth: TDaysInMonth
}