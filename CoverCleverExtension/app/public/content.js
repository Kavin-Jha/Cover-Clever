// Utility functions
function isCorrectPage(url) {
    console.log('Checking URL:', url); // Debug line
    const validUrls = {
        benefits: 'https://member.bluecrossma.com/myplans/benefits',
        deductible: 'https://member.bluecrossma.com/mydedco'
    };
    return Object.values(validUrls).some(validUrl => url.startsWith(validUrl));
}

async function expandAllPanels() {
    const expandButtons = document.querySelectorAll('mat-expansion-panel-header');
    let expandedCount = 0;
    
    for (const button of expandButtons) {
        if (!button.classList.contains('mat-expanded')) {
            button.click();
            expandedCount++;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return expandedCount;
}

// Benefits page scraper
async function scrapeBenefitsPage() {
    const result = {};
    const debug = {
        panelsFound: 0,
        emptyPanels: [],
        hiddenContent: [],
        structureIssues: []
    };
    
    // Find all expansion panels using the more specific selector from working version
    const expansionPanels = document.querySelectorAll('.mat-expansion-panel-content');
    debug.panelsFound = expansionPanels.length;
    
    expansionPanels.forEach(panel => {
        // Use the working version's method to find the title
        const panelId = panel.id;
        const headerId = panelId.replace('cdk-accordion-child-', 'mat-expansion-panel-header-');
        const titleElement = document.querySelector(`#${headerId} [class*="mat-expansion-panel-header-title"][class*="mat-accordion-name"][class*="ng-tns-"]`);
        
        if (titleElement) {
            const careTitle = titleElement.textContent.trim();
            const careContent = {};
            
            // Check if parent panel is expanded
            const parentPanel = panel.closest('.mat-expansion-panel');
            const isExpanded = parentPanel && parentPanel.classList.contains('mat-expanded');
            if (!isExpanded) {
                debug.hiddenContent.push(careTitle);
            }
            
            // First try to find sections
            const sections = panel.querySelectorAll('.mat-service-header');
            
            if (sections.length === 0) {
                // If no sections found, look for direct service labels and values
                const container = panel.querySelector('.col.s12.m12.pd-0');
                if (container) {
                    const directContent = {};
                    
                    // Find all label-value pairs in the container and its children
                    const labelElements = container.querySelectorAll('.mat-service-label');
                    
                    labelElements.forEach(labelDiv => {
                        const labelText = labelDiv.querySelector('.network-margin')?.textContent?.trim();
                        const valueDiv = labelDiv.parentElement.querySelector('.mat-service-value');
                        
                        if (labelText && valueDiv) {
                            const valueText = Array.from(valueDiv.querySelectorAll('div'))
                                .map(el => el.textContent.trim())
                                .filter(text => text)
                                .join(' ');
                            
                            if (valueText) {
                                directContent[labelText] = valueText;
                            }
                        }
                    });
                    
                    if (Object.keys(directContent).length === 0) {
                        debug.emptyPanels.push(careTitle);
                    }
                    
                    careContent['Default'] = directContent;
                } else {
                    debug.structureIssues.push(`No container found for ${careTitle}`);
                }
            } else {
                sections.forEach(section => {
                    const sectionTitle = section.textContent.trim();
                    const sectionContent = {};
                    
                    // Get the parent container that holds the section content
                    const container = section.closest('.col.s12.m12.pd-0');
                    
                    if (!container) {
                        debug.structureIssues.push(`No container found for section ${sectionTitle} in ${careTitle}`);
                        return;
                    }
                    
                    // Find all rows in this section
                    const rows = container.querySelectorAll('.mb-10.row');
                    
                    if (rows.length === 0) {
                        debug.structureIssues.push(`No rows found for section ${sectionTitle} in ${careTitle}`);
                    }
                    
                    rows.forEach(row => {
                        const labelElement = row.querySelector('.mat-service-label .network-margin');
                        const valueElements = row.querySelectorAll('.mat-service-value div');
                        
                        if (!labelElement || valueElements.length === 0) {
                            debug.structureIssues.push(`Missing label or value in ${careTitle} - ${sectionTitle}`);
                            return;
                        }
                        
                        const label = labelElement.textContent.trim();
                        const value = Array.from(valueElements)
                            .map(el => el.textContent.trim())
                            .filter(text => text)
                            .join(' ');
                        
                        if (label && value) {
                            sectionContent[label] = value;
                        }
                    });
                    
                    if (Object.keys(sectionContent).length === 0) {
                        debug.emptyPanels.push(`${careTitle} - ${sectionTitle}`);
                    }
                    
                    careContent[sectionTitle] = sectionContent;
                });
            }
            
            result[careTitle] = {
                content: careContent
            };
        }
    });
    
    // Log complete debug information
    console.log('=== COMPLETE DEBUG INFORMATION ===');
    console.log('Total panels found:', debug.panelsFound);
    console.log('Hidden panels:', debug.hiddenContent);
    console.log('Empty panels:', debug.emptyPanels);
    console.log('Structure issues:', debug.structureIssues);
    console.log('=== END DEBUG INFORMATION ===');
    
    return {result, debug };
}

// Deductible page scraper
async function scrapeDeductiblePage() {
    const debug = {
        sectionsFound: 0,
        panelsExpanded: 0,
        errors: [],
        url: window.location.href
    };

    debug.panelsExpanded = await expandAllPanels();
    const result = {};

    const mainSections = document.querySelectorAll('section.my-dedco-section');
    debug.sectionsFound = mainSections.length;

    mainSections.forEach(section => {
        // Get the plan title
        const titleElement = section.querySelector('h2');
        if (!titleElement) {
            debug.errors.push('Missing title element');
            return;
        }
        const planTitle = titleElement.textContent.trim();
        result[planTitle] = {};

        // Find all subsections (network types)
        const subSections = section.querySelectorAll('section.my-dedco-sub-section');
        subSections.forEach(subSection => {
            // Get network type
            const networkTypeElement = subSection.querySelector('.my-dedco-network-info h5');
            if (!networkTypeElement) {
                debug.errors.push(`Missing network type for ${planTitle}`);
                return;
            }
            const networkType = networkTypeElement.textContent.trim().toLowerCase();

            // Initialize network object if it doesn't exist
            if (!result[planTitle][networkType]) {
                result[planTitle][networkType] = {};
            }

            // Get chart container info
            const chartContainer = subSection.querySelector('.chart-container');
            if (chartContainer) {
                const typeElement = chartContainer.querySelector('header span');
                const type = typeElement ? typeElement.textContent.trim().toLowerCase().replace(':', '') : '';
                
                if (type) {
                    result[planTitle][networkType][type] = {};
                    
                    // Get contributed and remaining values
                    const contributedElement = chartContainer.querySelector('.chart-bottom-option:first-child .chart-bottom-text p');
                    const remainingElement = chartContainer.querySelector('.chart-bottom-option:last-child .chart-bottom-text p');
                    
                    if (contributedElement) {
                        result[planTitle][networkType][type]['contributed'] = contributedElement.textContent.trim();
                    }
                    if (remainingElement) {
                        result[planTitle][networkType][type]['remaining to meet'] = remainingElement.textContent.trim();
                    }

                    // Get limitations and exceptions
                    const limitationsPanel = subSection.querySelector('.my-dedco-limitations .content');
                    const exceptionsPanel = subSection.querySelector('.my-dedco-exceptions .content');
                    
                    if (limitationsPanel) {
                        result[planTitle][networkType][type]['limitations'] = limitationsPanel.textContent.trim();
                    }
                    if (exceptionsPanel) {
                        result[planTitle][networkType][type]['exceptions & exclusions'] = exceptionsPanel.textContent.trim();
                    }
                }
            }
        });
    });

    return { result, debug };
}

// Main scraping controller
async function scrapeWithExpansion() {
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl); // Debug line
    
    if (!isCorrectPage(currentUrl)) {
        console.log('URL validation failed'); // Debug line
        return {
            result: null,
            debug: {
                error: 'Unsupported page',
                actualUrl: currentUrl
            }
        };
    }

    // Expand all panels first
    await expandAllPanels();

    // Determine which scraper to use based on the URL
    if (currentUrl.includes('myplans/benefits')) {  // Changed from 'mybenefits'
        return await scrapeBenefitsPage();
    } else if (currentUrl.includes('mydedco')) {
        return await scrapeDeductiblePage();
    }
}

// Execute the scraping
(async () => {
    try {
        const { result, debug } = await scrapeWithExpansion();
        chrome.runtime.sendMessage({
            action: "storeData",
            data: result,
            debug: debug
        }, (response) => {
            console.log("Response from background:", response);
        });
    } catch (error) {
        console.error("Error during scraping:", error);
    }
})();









