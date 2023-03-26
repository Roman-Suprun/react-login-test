import axios from 'axios';

import utils from '../../utils/utils';

const SERVER_URL = 'https://date.nager.at';
const GET_PUBLIC_HOLIDAY = '/api/v3/PublicHolidays/{0}/{1}';

const getUrl = (path: string, params: string[] = []) => {
    return SERVER_URL + utils.formatString(path, ...params);
};
const getPublicHoliday = async (year: string, countryCode: string) => {
    try {
        const publicHoliday = await axios.get(getUrl(GET_PUBLIC_HOLIDAY, [year, countryCode]));

        return publicHoliday.data;
    } catch (e) {
        console.log(e);
    }
};

export default {
    getPublicHoliday,
};
