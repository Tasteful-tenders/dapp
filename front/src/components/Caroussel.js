import React, { Component } from 'react';

import caroussel from '../img/caroussel.png';

class Caroussel extends Component {
    render() {
        return(
            <div class="bg-black h-caroussel font-all font-black text-white align-middle">
                <div class="text-xl uppercase">Build your own nft</div>
                <div class="text-big">Let your imagination take over</div>
            </div>
        );
    }
}

export { Caroussel };