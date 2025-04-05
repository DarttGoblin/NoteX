const notes_container = document.querySelector('.notes-container');
const save_to_local = document.querySelector('.save-to-local');
const clear_vault = document.querySelector('.clear-vault');

RetrieveNotes();
save_to_local.onclick = SaveToLocalFile;
clear_vault.onclick = ClearVault;

function RetrieveNotes() {
    notes_container.innerHTML = '';
    chrome.storage.local.get({ notes: [] }, function(data) {
        const notes = data.notes;
        
        if (notes.length == 0) {
            const no_notes = document.createElement('span');
            no_notes.innerHTML = 'No notes yet!<br>Every great thought deserves to be saved! 📝💡';
            no_notes.classList.add('no-notes');
            notes_container.appendChild(no_notes);
            AdjustHeight();
            return;
        }

        notes.forEach(note => {
            CreateNote(note);
        });

        AdjustHeight();
    });
}

function CreateNote(note) {
    const note_container = document.createElement('div');
    const trash_icon = document.createElement('i');
    const timestamp = document.createElement('span');
    const note_link = document.createElement('span');
    const note_span = document.createElement('span');

    note_container.classList.add('note-container');
    trash_icon.classList.add('note-trash-icon', 'fa', 'fa-trash');
    trash_icon.setAttribute('note-id', note.id);
    trash_icon.onclick = function() {RemoveNote(note.id)};
    timestamp.classList.add('timestamp');
    note_link.classList.add('note-link');

    timestamp.textContent = note.timestamp;
    note_span.textContent = note.content;
    note_link.textContent = 'Http';
    note_link.onclick = function() {window.open(note.link, '_blank');}

    note_container.appendChild(trash_icon);
    note_container.appendChild(timestamp);
    note_container.appendChild(note_link);
    note_container.appendChild(note_span);

    notes_container.appendChild(note_container);
}

function RemoveNote(note_id) {
    const user_answer = confirm("Are you sure? This action can't be undone!");
    if (user_answer) {
        chrome.storage.local.get({ notes: [] }, function(data) {
            const notes_filtered = data.notes.filter(note => note.id !== note_id);
            chrome.storage.local.set({notes: notes_filtered});
            RetrieveNotes();
        })
    }
}

function ClearVault() {
    chrome.storage.local.get({ notes: [] }, function(data) {
        const notes = data.notes;
        if (notes.length == 0) {return;}

        const user_answer = confirm('Are you sure?');
        if (user_answer) {
            chrome.storage.local.set({ notes: [] });
            RetrieveNotes();
        }
    });
}

function SaveToLocalFile() {
    chrome.storage.local.get({ notes: [] }, function(data) {
        const notes = data.notes;
        if (notes.length == 0) {return;}
        
        const seperater = '---------------------------------------------------------';
        const formatted_notes = notes.map(note => `_${note.timestamp}\n_${note.link}\n_${note.content.trim()}\n`).join(`\n${seperater}\n\n`);
        const saved_text = new Blob([formatted_notes], { type: 'text/plain' });
        const saved_text_url = URL.createObjectURL(saved_text);

        chrome.downloads.download({
            url: saved_text_url,
            filename: 'notes.txt',
            saveAs: true
        });
    });
}