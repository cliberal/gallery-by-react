require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageData = require('../data/imageData.json');

//将图片信息转换成URL信息
imageData = (function getImageURL(imageDataArr) {
    for (let i = 0, j = imageDataArr.length; i < j; i++) {
        let singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageData);

class AppComponent extends React.Component {
    render() {
        return (
            <section className="stage">
                <section className="img-sec">

                </section>
                <nav className="controller-nav">

                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
