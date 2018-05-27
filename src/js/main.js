"use strict";

import {detectIE} from "./page/utilities";
import {AnimateText} from "./page/animateText";
import {DrawStroke} from "./page/drawStroke";

if (detectIE()) document.body.classList.add('ie');

// Flick through the featured texts in jumbo
const _animateText = new AnimateText({
    id: 'jumbo-feature',
    interval: 2000
}).init();

// Signature strokes
const _drawSignature = new DrawStroke({
    id: 'signature-zh'
});
if (_drawSignature.isEnabled()) _drawSignature.init();