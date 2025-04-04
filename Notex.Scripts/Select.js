console.log('hi');
// chrome.tabs.insertCSS(null, { file: '../Notex.Styles/Select.css' }, function() {
    // console.log('css has been injected');
// });
// console.log('css has been injected');
TakeNotes();

function TakeNotes() {
    console.log('listening to user selects...');
    document.addEventListener('mouseup', (event) => {
        const selected_text = window.getSelection().toString().trim();
        if (!selected_text) {return;}
        console.log('button creation...');

        const popup_button = document.createElement('button');
        // const popup_button_img = document.createElement('img');
        popup_button.classList.add('popup-button');
        popup_button.textContent = 'note';
        // popup_button_img.classList.add('popup-button-img');
        // popup_button_img.src = '../Chronix.Media/Notex.png';
        // popup_button.appendChild(popup_button_img);
        
        popup_button.style.position = 'absolute';
        popup_button.style.left = `${event.clientX + 5}px`;
        popup_button.style.top = `${event.clientY + 5}px`;  
        popup_button.style.zIndex = '9999';
        document.body.appendChild(popup_button);

        popup_button.onclick = function() {
            console.log('popup button clicked!');
            const link = window.location.href;
            const note = { timestamp: Timestamp(), link, content: selected_text };
            chrome.runtime.sendMessage({ note: note });
            document.body.removeChild(popup_button);
        }
    });
}

function Timestamp() {
    const timestamp = new Date();

    const yyyy = timestamp.getFullYear();
    const mm = String(timestamp.getMonth() + 1).padStart(2, '0');
    const dd = String(timestamp.getDate()).padStart(2, '0');
    const hh = String(timestamp.getHours()).padStart(2, '0');
    const min = String(timestamp.getMinutes()).padStart(2, '0');
    
    return `${yyyy}:${mm}:${dd} ${hh}:${min}`;
}