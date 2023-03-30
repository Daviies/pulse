chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === 'showTabs') {
        chrome.tabs.query({}, tabs => {
            chrome.tabs.sendMessage(sender.tab.id, { action: 'showTabs', tabs });
        });
    }
});