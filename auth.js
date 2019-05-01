//Change page appearance depending on login status
//Hides logout and account buttons when not logged in
//Hides login and signup buttons when logged in.

//Checks for status changes, both login/logout
//and updates from firebase in real time
var userUID = null;
auth.onAuthStateChanged(user => {
    userUID = user.uid;
    console.log(userUID);
    //if user is logged in, do x
    if (user){

        //Get data and constantly update it
        db.collection('userNotes').onSnapshot(snapshot => {
        setupNotes(snapshot.docs);
        setupUI(user);
        }, err => {
            console.log(err.message)
        });
    }
    //if user is logged out, do y.
    //if logged out, user == null.
    else {

        setupNotes([]);
        setupUI();

        console.log('User logged out.');
    }
});




//Create notes
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) =>{
    //prevents auto-refresh
    e.preventDefault();

    //takes title and content as input and stores in firebase database
    db.collection('userNotes').add({
        title: createForm.title.value,
        content: createForm.content.value

    }).then(() => {
        //empties form & closes modal
        const modal = document.querySelector('#modal-notes');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    //error catcher
    }).catch(err => {
        console.log(err.message);
      });
});


//Authentication for sign-up

//.then refers to a type of event called a promise
//a promise means that the auth server tells the program an event will eventually happen.
//when the event happens, .then fires.
//Lets us query events for the CSS without it going off prematurely.

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

    //actual account creation
    auth.createUserWithEmailAndPassword(email,password).then(cred =>{

        //adds user to the database
        return db.collection('users').doc(cred.user.uid).set({
            usn: signupForm['signup-usn'].value,
            firstName: null,
            lastName: null,
            userEmail: email,
            userPassword: password,
            
        });
      
    }).then(() => {
          //Closes pop-up after signup is complete
          const modal = document.querySelector('#modal-signup');
          M.Modal.getInstance(modal).close();
  
          //Resets form
          signupForm.reset();
    });
});

//Edit account
const editAccount = document.querySelector('#editAcc-form');
editAccount.addEventListener('submit', (e) =>{
    e.preventDefault();

    const editFirstName = editAccount['firstName'].value;
    //console.log(editFirstName);
    const editLastName = editAccount['lastName'].value;

    return db.collection('users').doc(userUID).update({
        firstName: editFirstName,
        lastName: editLastName,
    });
});



//Login

const login = document.querySelector('#login-form');
login.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get info
    const email = login['login-email'].value;
    const password = login['login-password'].value;

    //actual sign-in method
    auth.signInWithEmailAndPassword(email,password).then(cred => {

        //Closes pop-up after sign in is complete
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();

        //Resets form
        login.reset();
    });

   

})



//Logout

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {

    e.preventDefault();
    auth.signOut();


})