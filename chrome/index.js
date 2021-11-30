function injectScript(filePath, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement(`script`);
    script.setAttribute(`type`, `text/javascript`);
    script.setAttribute(`src`, filePath);
    node.appendChild(script);
}

injectScript(chrome.runtime.getURL(`/plugin.js`), `body`);