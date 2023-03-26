import {createBrowserHistory} from 'history';

let history;

const getHistory = () => {
    if (!history) {
        history = createBrowserHistory({
            basename: '',
        });
    }

    return history;
};

export default getHistory;
