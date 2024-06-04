"use strict";

const $htmlTextarea = document.getElementById("htmlCode");
const $cssTextarea = document.getElementById("cssCode");
const $jsTextarea = document.getElementById("jsCode");
const previewWindow = document.getElementById("preview-window");

// Retrieve the code from local storage or set defaults
const defaultCode = {
    html: "<div>\n\n</div>",
    css: "<style>\n\n</style>",
    js: "<script>\n\n</script>",
};

// get the code from local storage
const savedCode = JSON.parse(localStorage.getItem("code")) || defaultCode;

$htmlTextarea.value = savedCode.html;
$cssTextarea.value = savedCode.css;
$jsTextarea.value = savedCode.js;

function showPreview() {
    const htmlCode = $htmlTextarea.value;
    const cssCode = $cssTextarea.value;
    const jsCode = $jsTextarea.value;

    const frame = previewWindow.contentWindow.document;
    frame.open();
    frame.write(`<!DOCTYPE html>${htmlCode}${cssCode}${jsCode}`);
    frame.close();

    // save the code in local storage
    localStorage.setItem("code", JSON.stringify({ html: htmlCode, css: cssCode, js: jsCode })
    );
}

const $tabsBtn = document.querySelectorAll("[data-tab-btn]");
let $lastActiveTabBtn = $tabsBtn[0];
let $lastActiveTabContent = document.querySelector("[data-tab-content]");

$tabsBtn.forEach(($btnTab) => {
    $btnTab.addEventListener("click", function () {
        $lastActiveTabContent.classList.remove("active");
        $lastActiveTabBtn.classList.remove("active");

        const $tabContent = document.querySelector(`[data-tab-content="${this.dataset.tabBtn}"]`);

        $tabContent.classList.add("active");
        this.classList.add("active");

        $lastActiveTabContent = $tabContent;
        $lastActiveTabBtn = this;
    });
});

// Debounce function to limit the rate of calling showPreview

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Debounce the showPreview function
const debouncedShowPreview = debounce(showPreview, 300);

$htmlTextarea.addEventListener("input", debouncedShowPreview);
$cssTextarea.addEventListener("input", debouncedShowPreview);
$jsTextarea.addEventListener("input", debouncedShowPreview);

// Initial call to showPreview
showPreview();
