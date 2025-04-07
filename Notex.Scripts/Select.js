TakeNotes();

function TakeNotes() {
    document.addEventListener('mousedown', (event) => {
        if (!event.target.classList.contains('popup-button')) {
            RemoveButton();
        }
    });
    document.addEventListener('mouseup', (event) => {
        setTimeout(() => {
            const selected_text = window.getSelection().toString().trim();
            if (selected_text.length > 0) {
                CreateButton(event, selected_text);
            }
        }, 10);
      });
}

function CreateButton(event, selected_text) {
    RemoveButton();
    const popup_button = document.createElement('button');
    StyleButton(popup_button, event.pageX, event.pageY);
    document.body.appendChild(popup_button);

    popup_button.onclick = function () {
        console.log('button clicked...');
        const link = window.location.href;
        const note = { id: GenerateId(), timestamp: Timestamp(), link, content: selected_text };
        chrome.storage.local.get({ notes: [] }, function (data) {
            const notes = data.notes;
            notes.push(note);
            chrome.storage.local.set({ notes });
            console.log('note saved');
        });
    };
}

function RemoveButton() {
    const previous_popup_buttons = document.querySelectorAll('.popup-button');
    if (previous_popup_buttons.length > 0) {
        previous_popup_buttons.forEach((button) => {
            document.body.removeChild(button);
        });
    }
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

function StyleButton(button, x_position, y_position) {
    button.textContent = '📌';
    button.className = 'popup-button';
    button.style.position = 'absolute';
    button.style.left = `${x_position + 5}px`;
    button.style.top = `${y_position + 5}px`;  
    button.style.padding = '3px 5px 5px 5px';
    button.style.backdropFilter = 'blur(10px)';
    button.style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
}

function GenerateId() {
    return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 6);
}