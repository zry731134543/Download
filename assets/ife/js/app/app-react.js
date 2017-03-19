// import React from 'lib/react';
// import ReactDOM from 'lib/react-dom';
console.log("app-react.js");
var example= document.getElementById('example');
// var names = ['Alice', 'Emily', 'Kate'];C
//        ReactDOM.render(<h1>Hello, world!</h1>,example);
//        ReactDOM.render(
//            <div>
//                {
//                    names.map(function (name) {
//                        return <div>Hello, {name}!</div>
//                    })
//                }
//            </div>,
//            example
//        );
var arr = [
    <h1>Hello world!</h1>,
<h2>React is awesome</h2>,
];
ReactDOM.render(
<div>{arr}</div>,
    document.getElementById('example')
);