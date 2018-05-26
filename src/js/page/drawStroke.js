import {detectIE, format, extend} from "./utilities";

export const DrawStroke = (function () {
    function DrawStroke(config) {
        // default
        this.options = {
            id: null, // svg element id
            startDelay: 1,
            speed: 300
        };
        // extend config
        extend(this.options, config);

        // components
        this.paths = null;
        this.css = '';

        // check required fields
        if (!this.options.id) throw 'The ID of the target element must be provided!';
    }

    DrawStroke.prototype.init = function () {
        const pathSelector = '#' + this.options.id + ' path';
        this.paths = this.paths || document.querySelectorAll(pathSelector);

        if (!this.paths || !this.paths.length)
            throw 'SVG paths are not found';

        const _paths = this.paths;

        // generate css for each path
        let totalDelay = this.options.startDelay;
        for (let i = 0; i < _paths.length; i++) {
            let p = _paths[i];
            const len = p.getTotalLength();
            const time = len / this.options.speed;
            const delay = totalDelay;
            totalDelay += time;
            this.css += format(this.TEMPLATE_CSS, {
                len: len,
                time: time,
                delay: delay,
                index: i + 1
            });
        }
        // append style to head
        const _style = document.createElement("style");
        _style.innerHTML = this.css;
        document.head.appendChild(_style);

        return this;
    };

    DrawStroke.prototype.isEnabled = function () {
        return !detectIE();
    };

    DrawStroke.prototype.TEMPLATE_CSS = `
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
    return DrawStroke;
}());