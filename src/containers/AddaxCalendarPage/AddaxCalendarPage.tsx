import * as htmlToImage from 'html-to-image';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

import api from './api';
import Calendar from './components/Calendar/Calendar';
import {TCalendarData, TPublicHolidays} from './models/models';

const HOLIDAY_YEAR = '2023';
const HOLIDAY_COUNTRY_CODE = 'ua';

const StyledExportButton = styled.button`
    border-radius: 10px;
    color: black;
    width: max-content;
    padding: 0 10px;
    height: 30px;
    background: rgb(238, 238, 238);
`;

const StyledImageDownloadButton = styled.button`
    border-radius: 10px;
    color: black;
    width: max-content;
    padding: 0 10px;
    height: 30px;
    background: rgb(238, 238, 238);
`;

const StyledButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const AddaxCalendarPage = () => {
    const [publicHolidays, setPublicHoliday] = useState<TPublicHolidays>([]);
    const [storedCalendarData, setStoredCalendarData] = useState<TCalendarData>({});

    const onExportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(storedCalendarData))}`;
        const link = document.createElement('a');

        link.href = jsonString;
        link.download = 'storedCalendarData.json';
        link.click();
    };

    const getPublicHolidays = async () => {
        const publicHoliday: TPublicHolidays = await api.getPublicHoliday(HOLIDAY_YEAR, HOLIDAY_COUNTRY_CODE);

        setPublicHoliday(publicHoliday);
    };

    useEffect(() => {
        getPublicHolidays();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target || {};

        if (files) {
            const fileReader = new FileReader();

            fileReader.readAsText(files[0], 'UTF-8');
            fileReader.onload = (e) => {
                const {result} = e.target || {};

                if (result) {
                    // @ts-ignore
                    setStoredCalendarData(() => JSON.parse(result));
                }
            };
        }
    };

    const ref = useRef<HTMLDivElement>(null);
    const download = async () => {
        if (ref.current) {
            const dataUrl = await htmlToImage.toPng(ref.current);
            const link = document.createElement('a');

            link.download = 'calendar.png';
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div ref={ref}>
            <StyledButtonsContainer>
                <input type='file' onChange={(e) => handleChange(e)} />
                <StyledExportButton onClick={onExportData}>Export calendar data</StyledExportButton>
                <StyledImageDownloadButton onClick={download}>Download calendar image</StyledImageDownloadButton>
            </StyledButtonsContainer>
            <Calendar
                publicHolidays={publicHolidays}
                setStoredCalendarData={setStoredCalendarData}
                storedCalendarData={storedCalendarData}
            />
        </div>
    );
};

export default AddaxCalendarPage;
