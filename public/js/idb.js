// Create variable to hold db connection
let db;

// establish the connection to IndexedDB, name it and set to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_budget`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_record', { autoIncrement: true });
  };

// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      uploadData();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// Save data if no internet connection
function saveData(data) {
    // create new transaction with db
    const record = db.record(['new_record'], 'readwrite');
    const recordObjectStore = record.objectStore('new_record');

    // add data to object store(table)
    recordObjectStore.add(data);
};

function uploadData() {
    const record = db.record(['new_record'], 'readwrite');
    const recordObjectStore = record.objectStore('new_record');

    // function to get all data
    const getAll = recordObjectStore.getAll();

    // On success of getAll function, upload
    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {'Content-Type': 'application/json'}
            })
            .then( data => data.json())
            .then((data) => {
                if(data.message) {
                    throw new Error(data);
                }
                
                const record = db.record(['new_record'], 'readwrite');
                const recordObjectStore = record.objectStore('new_record');
                recordObjectStore.clear();

                alert('All saved records have been uploaded to your budget!!')


            })
            .catch(err => {console.log(err)})
        }
    }
};

window.addEventListener('online', uploadData);