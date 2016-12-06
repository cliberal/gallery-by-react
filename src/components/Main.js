'use strict';

require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageData = require('../data/imageData.json');


imageData = (function getImageURL(imageDataArr) {
    for (let i = 0, j = imageDataArr.length; i < j; i++) {
        let singleImageData = imageDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageData);

let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
let get30DegRandom = () => ((Math.random() > 0.5) ? '' : '-') + Math.ceil(Math.random() * 30);

class ImgFigure extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.inverse();
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let styleObj = {};

        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        if (this.props.arrange.rotate) {
            (['MozTransform', 'WebkitTransform', 'MsTransform', 'transform']).forEach((value) => {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg';
            });
        }

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : ' ';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

class ControllerUnit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.inverse();
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render() {

        let controllerUnitClassName = 'controller-unit';
        if (this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center ';
            if (this.props.arrange.isInverse) {
                controllerUnitClassName += 'is-inverse';
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}/>
        );
    }

}

class AppComponent extends React.Component {

    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                top: 0,
                left: 0
            },
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            }
        };
        this.state = {
            imgArrangeArr: [
                /*{
                 pos: {
                 left: 0,
                 top: 0
                 },
                 rotate: 0,
                 isInverse: false,
                 isCenter: false
                 }*/
            ]
        };
        this.inverse = this.inverse.bind(this);
        this.center = this.center.bind(this);
    }

    inverse(index) {
        return () => {
            let imgArrangeArr = this.state.imgArrangeArr;
            imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
            this.setState({
                imgArrangeArr: imgArrangeArr
            });
        };
    }

    center(index){
        return () => {
            this.rearrange(index);
        }
    }

    rearrange(centerIndex) {
        let imgArrangeArr = this.state.imgArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,

            imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

        imgArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        for (let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;


            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        }
        imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

        this.setState({
            imgArrangeArr: imgArrangeArr
        });
    }



    componentDidMount() {
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            halfStageW = Math.ceil(stageDOM.scrollWidth / 2),
            halfStageH = Math.ceil(stageDOM.scrollHeight / 2);

        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            halfImgW = Math.ceil(imgFigureDOM.scrollWidth / 2),
            halfImgH = Math.ceil(imgFigureDOM.scrollHeight / 2);

        this.Constant.centerPos = {
            top: halfStageH - halfImgH*1.2,
            left: halfStageW - halfImgW
        };

        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = halfStageW * 2 - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = halfStageH * 2 - halfImgH;

        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
    }

    render() {
        let controllerUnits = [], imgFigures = [];
        imageData.forEach(function(value, index) {
            if (!this.state.imgArrangeArr[index]) {
                this.state.imgArrangeArr[index] = {
                    pos: {
                        top: 0,
                        left: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                };
            }
            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index}
                                       arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        }.bind(this));


        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
