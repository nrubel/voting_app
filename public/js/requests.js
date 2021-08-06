var app = new Vue({
    el: '#app',
    data: {
        requests: [],
        loading: false,
    },
    methods: {
        upvoteRequest: async (id) => {
            try{
                this.loading = true;
                const upvote = firebase.functions().httpsCallable('upvote');
                await upvote({id})
            }catch(error){
                const notification = document.querySelector('.notification');
                notification.textContent = error.message;
                notification.classList.add('active');
                setTimeout(() => {
                    notification.textContent = '';
                    notification.classList.remove('active');
                }, 3000);
            }finally{
                this.loading = false;
            }
        },
    },
    mounted() {
        const ref = firebase.firestore().collection('requests').orderBy('upvotes', 'desc');

        ref.onSnapshot(snapshot => {
            let requests = [];
            snapshot.forEach(doc => {
                requests.push({...doc.data(), id: doc.id});
            });
            this.requests = requests;
        });
    },
})
