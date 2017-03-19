require.config({
    paths: {
        "jquery":"build/jquery.min",
        "react":"build/react",
        "dom":"build/react-dom",
        "browser":"build/browser.min"
        // "reacthtml":"app/reacthtml"
    }
});
require(['jquery','react','dom','browser'], function () {

});