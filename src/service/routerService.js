import history from './history';
const forwardTo = (location) => history.getHistory().push(location);

const forwardToNotFound = () => history.getHistory().push('*');

const goBack = () => history.getHistory().goBack();

const reload = () => window.location.reload();

const replace = (location) => history.getHistory().replace(location);

const redirect = (location) => {
    window.location.href = location;
};

const blankLinkOpen = (url) => {
    window.open(url, '_blank');
};

const exportedObject = {
    blankLinkOpen,
    forwardTo,
    forwardToNotFound,
    goBack,
    redirect,
    reload,
    replace,
};

export default exportedObject;
