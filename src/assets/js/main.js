// styles

import '../styles/normalize.scss';
import '../styles/style.scss';

import '../styles/lib/fonts.scss';

import '../styles/blocks/grid.scss'
import '../styles/blocks/text.scss';
import '../styles/blocks/cargo.scss';
import '../styles/blocks/transport.scss';
import '../styles/blocks/time.scss';
import '../styles/blocks/tip.scss';
import '../styles/blocks/checkbox.scss';
import '../styles/blocks/customSelect.scss';

// scripts

import { toggleTempMode } from './toggleTempMode';
import { customSelect } from './customSelect';

window.addEventListener('DOMContentLoaded', 
    () => {
        customSelect('transport');
        customSelect('load', true);
        customSelect('cargo');
        customSelect('danger', true);
        toggleTempMode();
    })
