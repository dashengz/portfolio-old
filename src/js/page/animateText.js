import {extend} from "./utilities";

export const AnimateText = (function () {
    function AnimateText(config) {
        // default
        this.options = {
            id: null, // id of the target element
            interval: 2000
        };
        // extend config
        extend(this.options, config);

        // components
        this.target = null;
        this.content = null;

        // check required fields
        if (!this.options.id) throw 'The ID of the target element must be provided!';
    }

    AnimateText.prototype.init = function () {
        this.target = this.target || document.getElementById(this.options.id);
        this.content = this.content || this.target.getAttribute('data-content').split('|');

        if (!(this.target && this.content))
            throw 'At least one required component is not found!';

        const _target = this.target;
        const _content = this.content;

        // Initial text
        _target.innerText = _content[0];
        // Iterate through the array
        let counter = 1;
        const len = _content.length;
        setInterval(function iterate() {
            _target.innerText = _content[counter++ % len];
        }, this.options.interval);

        return this;
    };

    return AnimateText;
}());