export const format = (template, options) =>
    template.replace(/{{(.*?)}}/gm, (match, content) => options[content]);

export const detectIE = () => {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ') !== -1,
        trident = ua.indexOf('Trident/') !== -1,
        edge = ua.indexOf('Edge/') !== -1;
    return msie || trident || edge;
};

export const extend = (original, target) => {
    for (let key in target) {
        if (target.hasOwnProperty(key)) {
            original[key] = target[key];
        }
    }
    return original;
};