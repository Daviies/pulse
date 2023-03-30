let vm = Vue.createApp({
    data(){
        return {
            show_page: 0,
            loading_status: false,
            searchInput:"",
            show_single_data: [],
            arrayShowing: 0,
            disable_button: false
        }
    },
    methods:{
        show_search_input_page(){   
            this.show_page = 1
        },
        goHome(){
            this.show_page = 0
        },
        goScanBrowser(){
            console.log(this.show_page)
            this.show_page = 2
        },
        async requestSingleWebCookies() {
            this.show_single_data = []
            this.loading_status = true
            console.log(this.loading_status);
            let data = { 'singleWebsite': this.searchInput}
            let url = 'http://localhost:3000/singleweb'
            await fetch( url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then( response => response.json() )
            .then( data => { this.loading_status = false; this.arrayShowing = 1; this.show_single_data = data.cookies; console.log(data, this.loading_status)} )
            .catch( err => { this.loading_status = false; console.error(err, this.loading_status )} )
        }
    },
    // computed:{ }
    watch: {
        searchInput() {
            let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            !!pattern.test(this.searchInput) ? this.disable_button = true : this.disable_button = false ;
            console.log(this.disable_button)
        }
    }
}).mount('#app')

