"use strict";

const format = (template, options) =>
    template.replace(/{{(.*?)}}/gm, (match, content) => options[content]);

const detectIE = () => {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ') !== -1,
        trident = ua.indexOf('Trident/') !== -1,
        edge = ua.indexOf('Edge/') !== -1;
    return msie || trident || edge;
};

if (detectIE()) document.body.classList.add('ie');

// Set home height to window height on load
const PADDING_HOME = 48;
(function (padding) {
    const HOME = document.getElementById('home');
    HOME.style.height = (window.innerHeight - padding * 2) + 'px';
})(PADDING_HOME);

// Flick through the featured texts in jumbo
(function () {
    const JUMBO = document.getElementById('jumbo-feature');
    const CONTENT = JUMBO.getAttribute('data-content').split('|');
    const INTERVAL = parseInt(JUMBO.getAttribute('data-interval'));
    JUMBO.innerText = CONTENT[0];
    let counter = 1;
    const LEN = CONTENT.length;
    setInterval(() => {
        JUMBO.innerText = CONTENT[counter++ % LEN];
    }, INTERVAL);
})();

// Signature strokes
const SPEED = 300;
const STROKE_START_DELAY = 1;
(function (speed, startDelay) {
    let totalDelay = startDelay;
    const TEMPLATE_CSS = `
        #signature path:nth-child({{index}}) {
            stroke-dasharray: {{len}};
            stroke-dashoffset: {{len}};
            -webkit-animation: dash-{{index}} {{time}}s {{delay}}s linear forwards;
            animation: dash-{{index}} {{time}}s {{delay}}s linear forwards;
        }
        @-webkit-keyframes dash-{{index}} {
            from {
                stroke-dashoffset: {{len}};
            }
            to {
                stroke-dashoffset: 0;
            }
        }
        @keyframes dash-{{index}} {
            from {
                stroke-dashoffset: {{len}};
            }
            to {
                stroke-dashoffset: 0;
            }
        }
    `;
    const PATHS = document.querySelectorAll('#signature path');
    let css = "";
    for (let i = 0; i < PATHS.length; i++) {
        let p = PATHS[i];
        const LEN = p.getTotalLength();
        const TIME = LEN / speed;
        const DELAY = totalDelay;
        totalDelay += TIME;
        const OPTIONS = {
            len: LEN,
            time: TIME,
            delay: DELAY,
            index: i + 1
        };
        css += format(TEMPLATE_CSS, OPTIONS);
    }
    const STYLE = document.createElement("style");
    STYLE.innerHTML = css;
    document.head.appendChild(STYLE);
})(SPEED, STROKE_START_DELAY);