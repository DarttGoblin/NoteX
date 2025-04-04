const vault_container = document.querySelector('.vault-container');
const save_to_local = document.querySelector('.save-to-local');
const clear_vault = document.querySelector('.clear-vault');

RetrieveNotes();
NotesCollector();
save_to_local.onclick = SaveToLocalFile;
clear_vault.onclick = ClearVault;

function NotesCollector() {
    chrome.runtime.onMessage.addListener((note) => {
        chrome.storage.local.get({ notes: [] }, function(data) {
            const notes = data.notes;
            notes.push(note);
            chrome.storage.local.set({ notes: notes }, RetrieveNotes());
        });
    });
}

function RetrieveNotes() {
    chrome.storage.local.get({ notes: [] }, function(data) {
        const notes = data.notes;
        
        if (notes.length == 0) {
            const no_notes = document.createElement('span');
            no_notes.innerHTML = 'No notes yet!<br>Every great thought deserves to be saved! 📝💡';
            no_notes.classList.add('no-notes');
            vault_container.appendChild(no_notes);
            return;
        }
        notes.forEach(note => {
            CreateNote(note);
        });
    });
}

function CreateNote(note) {
    const note_container = document.createElement('div');
    const trash_icon = document.createElement('i');
    const timestamp = document.createElement('span');
    const note_link = document.createElement('span');
    const note_span = document.createElement('span');

    trash_icon.classList.add('note-trash-icon', 'fa', 'fa-trash');
    note_container.classList.add('note-container');
    note_link.classList.add('note-link');

    timestamp.textContent = note.timestamp;
    note_link.textContent = note.link;
    note_span.textContent = note.content;

    note_container.appendChild(trash_icon);
    note_container.appendChild(timestamp);
    note_container.appendChild(note_link);
    note_container.appendChild(note_span);

    vault_container.appendChild(note_container);
}

function SaveToLocalFile() {
    console.log('saved to local file');
}

function ClearVault() {
    const user_answer = confirm('Are you sure?');
    if (user_answer) {
        chrome.storage.local.set({ notes: [] }, RetrieveNotes());
    }
}