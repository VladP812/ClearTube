console.log('ClearTube extension loaded!');

const isHomePage = () => window.location.pathname === '/';
let searchOriginalParent = null;
let searchOriginalNextSibling = null;

function cleanHomePage() {
    if (!isHomePage()) return;
    if (document.getElementById('yt-focus-home')) return;

    const primaryContent = document.querySelector('ytd-browse[page-subtype="home"]');
    if (!primaryContent) return;

    const searchBox = document.querySelector('#center.ytd-masthead');
    searchBox.style.cssText += 'flex: 1 1 auto !important;';
    if (!searchBox) return;

    // Hide the feed
    const richGrid = primaryContent.querySelector('ytd-rich-grid-renderer');
    if (richGrid) richGrid.style.display = 'none';

    // Remember where search bar lives so we can put it back
    searchOriginalParent = searchBox.parentNode;
    searchOriginalNextSibling = searchBox.nextSibling;

    // Build container
    const container = document.createElement('div');
    container.id = 'yt-focus-home';
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: Roboto, sans-serif;
        margin-top: 150px;
    `;

    const heading = document.createElement('h1');
    heading.textContent = 'ClearTube - you choose what you watch';
    heading.style.cssText = `color: #aaa; font-weight: 300; font-size: 48px; margin-bottom: 40px;`;
    searchBox.style.cssText += `width: 100%; max-width: 600px; margin: 0 auto; flex: 1 1 auto !important;`;

    container.appendChild(heading);
    container.appendChild(searchBox);
    primaryContent.appendChild(container);
}

const searchBox = document.querySelector('#center.ytd-masthead');
searchBox.style.setProperty('flex', '1 1 auto', 'important');

function restoreHomePage() {
    const container = document.getElementById('yt-focus-home');
    if (!container) return;

    // Move search bar back to header
    const searchBox = document.querySelector('#yt-focus-home #center');
    if (searchBox && searchOriginalParent) {
        searchBox.style.cssText = '';
        searchOriginalParent.insertBefore(searchBox, searchOriginalNextSibling);
    }

    container.remove();
}

window.addEventListener('yt-navigate-finish', () => {
    if (isHomePage()) {
        setTimeout(cleanHomePage, 300);
    } else {
        restoreHomePage();
    }
});


const observer = new MutationObserver(() => {
    cleanHomePage()
    searchBox.style.setProperty('flex', '1 1 auto', 'important');
});

observer.observe(searchBox, { attributes: true, attributeFilter: ['style'] });
observer.observe(document.body, { childList: true, subtree: true });

cleanHomePage();
