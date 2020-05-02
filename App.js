const apiKey = apiKeyCfg.Key;
const searchUrl ='https://api.setlist.fm/rest/1.0/search/artists?artistName='
const searchUrlEnd='&p=1&sort=relevance'
const proxyUrl = "https://lml-afk-cors-proxy.herokuapp.com/"; //proxy needed for api calls from frontend


function buildSetlistUrl(mbid){
  return proxyUrl + 'https://api.setlist.fm/rest/1.0/artist/' + mbid + '/setlists';
}


function buildSearchUrl(band) {
  return proxyUrl + searchUrl + band + searchUrlEnd;
}


var app = new Vue({
    el: '#AppBand',
      data:{
      bandDescription:"",
      band:"",
      userBand: [],
      mbid:"",
      setlist:[],
      userSetlist:[],
    },
    methods:{

        bandSearch(band){
        this.setlist =[];
        let url = buildSearchUrl(this.band);
        console.log(url);
        axios.get(url, {
          headers: {
            'x-api-key': apiKey ,
            'Accept': 'application/json',
          }

        }).then((response) => {

        this.userBand = []; // empty the array before new search
        this.userBand.push(response.data.artist[0].name);
        this.bandDescription = response.data.artist[0].disambiguation;
        this.mbid = response.data.artist[0].mbid;

      }).catch((error) => {console.log(error);this.userBand="";alert("No bands were found"); });
    },

    getPlaylist(mbid){
      let setlistUrl = buildSetlistUrl(mbid);
      axios.get(setlistUrl
        , {

            headers: {
              'x-api-key': apiKey ,
              'Accept': 'application/json',
            }

        }).then((response) =>{
          this.setlist=[]; //empty the array beofer new setlist
          // add songs to setlist array
          for (var i = 0; i < 25; i++) {
      this.setlist.push(response.data.setlist[2].sets.set[0].song[i].name);
    };


  }).catch((error) => {console.log(error); });

},
    //add clicked song and artist name to userSetlist array
      addSong(selectedSong){
      let newItem = this.userBand + " - " + selectedSong;
      //prevents adding of duplicate songs
      this.userSetlist.indexOf(newItem) === -1 ? this.userSetlist.push(newItem) : console.log("This song is already in the list");
  },

      //remove clicked song from userSong array
      removeSong(selectedSong){
        this.userSetlist.pop(selectedSong);
      },
      // clear users list
      clear(){
        this.userSetlist=[];
      },
    },



})
