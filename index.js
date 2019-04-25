const notesList = document.querySelector('.notes');

//these consts are used to help control which elements of the navbar
//are visible depending on user's login status.
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

//Holder for account details of logged in user.
const accountDetails = document.querySelector('.account-details');


//sets up UI visibility based on login status
const setupUI = (user) => {
    if (user){

        db.collection('users').doc(user.uid).get().then(doc =>{
            //Output account information on login
        const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        `;
        accountDetails.innerHTML = html;
        })
        //toggle UI elements for logged in users
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');

        
    }
    else{
      //toggle UI elements for logged out users
      loggedInLinks.forEach(item => item.style.display = 'none');
      loggedOutLinks.forEach(item => item.style.display = 'block');  

      //hides account info on logout
      accountDetails.innerHTML = '';
    }

}

//setup notes
const setupNotes = (data) => {

    //check for length on data. if length, display notes
    //if no length, show login prompt.
    if(data.length){

    let html = '';
    data.forEach(doc => {
        const note = doc.data();
        const li = `
            <li>
                <div class="collapsible-header grey lighten-4">${note.title}</div>
                <div class="collapsible-body white">${note.content}</div>
            </li>
        `;
        html += li;
    })

    notesList.innerHTML = html;
    } else {
        notesList.innerHTML = '<h5 class="center-align">Login to view notes</h5>'
    }
}


//setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);


});