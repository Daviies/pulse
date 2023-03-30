const button = document.querySelector('.browser_button');
const many_web_response = document.querySelector('.many_web_response');

button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'showTabs' });
});

let apiUrl = 'http://localhost:3000/manyweb' 

const requestWebData = async (url, data) => {
    const response = await fetch( url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return response
}

function validateURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

let dataArray = []

chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === 'showTabs') {
    
        const tabsInfoObj = msg.tabs
            .filter(eachTab => validateURL(eachTab.url))
            .map(eachTab => ({
                favIconUrl: eachTab.favIconUrl,
                url: eachTab.url,
                page: eachTab.title
            }));

       requestWebData(apiUrl, tabsInfoObj)
        .then( response => response.json() )
        .then( data => createTable(data) )
        .catch( err => console.error(err) ) 

    }
});


function createTable(dataArray) {
    // Create table element
    let table = document.createElement('table');
  
    // Create table header row
    let headerRow = document.createElement('tr');
    for (let key in dataArray[0].websiteDetails) {
      let th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    }
    for (let key in dataArray[0].cookies[0]) {
      let th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
  
    // Create table rows
    for (let i = 0; i < dataArray.length; i++) {
      for (let j = 0; j < dataArray[i].cookies.length; j++) {
        let tr = document.createElement('tr');
        for (let key in dataArray[i].websiteDetails) {
          let td = document.createElement('td');
          td.textContent = dataArray[i].websiteDetails[key];
          tr.appendChild(td);
        }
        for (let key in dataArray[i].cookies[j]) {
          let td = document.createElement('td');
          td.textContent = dataArray[i].cookies[j][key];
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
    }
  
    // Append table to body
    many_web_response.appendChild(table);
  }
  


