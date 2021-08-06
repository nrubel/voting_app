const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request'))
    requestModal.classList.remove('open');
});

// Say hello
// const button = document.querySelector(".call")
// button.addEventListener('click', () => {
//   // get fuction reference
//   const sayHello = firebase.functions().httpsCallable('sayHello')
//   sayHello({name: 'Nasir'}).then(res => {
//     console.log(res.data)
//   })
// })

// Add a new request
requestForm.addEventListener('submit', e => {
  e.preventDefault();

  const addRequest = firebase.functions().httpsCallable('addRequest');
  addRequest({text: requestForm.request.value})
    .then(res => {
      requestForm.reset();
      requestModal.classList.remove('open');
      requestForm.querySelector('.error').textContent = '';
    })
    .catch(err => {
      if(err)
        requestForm.querySelector('.error').textContent = err.message;
    });
});