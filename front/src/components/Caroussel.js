import React, { Component } from 'react';

import caroussel from '../img/caroussel.png';

class Caroussel extends Component {
    render() {
        return(
            <div className="bg-black h-caroussel font-all font-black text-white align-middle">
                <div className="text-xl uppercase">Build your own nft</div>
                <div className="text-big">Let your imagination take over</div>
            </div>
        );
    }
}

export { Caroussel };