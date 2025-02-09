console.log('Background script loaded!');

let scrapedData = null; // Store scraped data in background memory

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in background:', message);
    
    if (message.action === "storeData") {
        scrapedData = message.data;  // Save data from content.js
        console.log("Data received and stored in background:", scrapedData);

        // Send the data back to the Score component
        chrome.runtime.sendMessage({
            action: "scrapingComplete",
            data: scrapedData,
            debug: message.debug
        });
        
        sendResponse({ status: "success", message: "Data stored and sent" });
        return true; // Keep the message channel open for the async response
    }

    else if (message.action === "start") {
        console.log("Start action received. URL: ", message.url);

        // Update the current tab with the new URL
        chrome.tabs.update({ url: message.url }, (tab) => {
            console.log('Tab updated:', tab);
            
            // Wait for the page to load before injecting content script
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                console.log('Tab updated event:', tabId, info);
                
                if (tabId === tab.id && info.status === 'complete') {
                    console.log('Page load complete, executing content script');
                    
                    // Remove the listener once we've found our tab
                    chrome.tabs.onUpdated.removeListener(listener);
                    
                    // Execute content script after page is loaded
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }, () => {
                        console.log('content.js executed after page load');
                        sendResponse({ status: "success", message: "Navigation started" });
                    });
                }
            });
        });
        
        return true; // Keep the message channel open for the async response
    }
    
    else if (message.action === "download") {
        if (!scrapedData) {
            console.error("No data available to download.");
            sendResponse({ status: "error", message: "No data available" });
            return;
        }

        downloadScrapedData();

        sendResponse({ status: "success", message: "Download started" });
    }
    
    else {
        console.warn("Unknown action:", message.action);
        sendResponse({ status: "error", message: "Unknown action" });
    }
    
    return true; // Keep the message channel open for the async response
});

function downloadScrapedData() {
    // Create the blob with properly stringified data
    let blob = new Blob([JSON.stringify(scrapedData, null, 2)], { type: "application/json" });
    let reader = new FileReader();
    
    reader.onloadend = function() {
        chrome.downloads.download({
            url: reader.result,
            filename: "scraped_data.json",  // Changed to .json since we're saving JSON data
            saveAs: true
        });
    };
    
    reader.readAsDataURL(blob);
}