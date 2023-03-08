const getUuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const formatString = (string, ...values) => {
    for (let i = 0; i < values.length; i++) {
        string = string.replace(`{${i}}`, values[i]);
    }

    return string;
};
export default {
    getUuidv4,
    formatString,
}

