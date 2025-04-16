const notes_container = document.querySelector('.notes-container');
const save_to_local = document.querySelector('.save-to-local');
const clear_vault = document.querySelector('.clear-vault');
const add_note = document.querySelector('.add-note');

RetrieveNotes();
save_to_local.onclick = SaveToLocalFile;
clear_vault.onclick = ClearVault;
add_note.onclick = RequestUserInput;

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

function RequestUserInput() {
    const note_user_info = document.createElement('div');
    const note_user_content = document.createElement('input');
    const note_user_button = document.createElement('button');
    
    note_user_content.placeholder = 'Enter Note';
    note_user_content.type = 'text';
    note_user_button.innerHTML = 'Confirm';

    note_user_info.classList.add('note-user-info');
    note_user_content.classList.add('note-user-content');
    note_user_button.classList.add('note-user-button');

    note_user_info.appendChild(note_user_content);
    note_user_info.appendChild(note_user_button);
    notes_container.appendChild(note_user_info);
    
    note_user_button.onclick = function() {
        const written_note_content = note_user_content.value.trim(); 
    
        if (!written_note_content) {
            alert("Some information seems to be missing!");
            return;
        }

        const link = 'Note';
        const written_note = { id: GenerateId(), timestamp: Timestamp(), link, content: written_note_content };
        chrome.storage.local.get({ notes: [] }, function (data) {
            const notes = data.notes;
            notes.push(written_note);
    
            chrome.storage.local.set({ notes: notes }, function() {
                RetrieveNotes();
            });
        });
    }
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
    
    if (note.link == 'Note') {
        note_link.classList.remove('note-link');
        note_link.classList.add('user-note');
        note_link.textContent = 'Note';
        note_link.onclick = function(e) {e.preventDefault()};
    }

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

function Timestamp() {
    const timestamp = new Date();

    const yyyy = timestamp.getFullYear();
    const mm = String(timestamp.getMonth() + 1).padStart(2, '0');
    const dd = String(timestamp.getDate()).padStart(2, '0');
    const hh = String(timestamp.getHours()).padStart(2, '0');
    const min = String(timestamp.getMinutes()).padStart(2, '0');
    
    return `${yyyy}:${mm}:${dd} ${hh}:${min}`;
}

function GenerateId() {
    return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 6);
}