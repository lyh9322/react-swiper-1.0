import React from 'react';
import ReactDOM from 'react-dom';
import Banner from './component/Banner';
//=>公共样式
import "./static/css/reset.min.css"

let IMG_DATA = [];
for(let i=1;i<=5;i++){
    IMG_DATA.push({
        id:i,
        title:'',
        pic:require(`./static/images/${i}.jpg`)

    })  
}

ReactDOM.render(
    <main>
        <Banner data={IMG_DATA} interval={3000} step={1} speed={300}/>
    </main>,
    document.getElementById('root')
)