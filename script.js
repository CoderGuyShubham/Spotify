let currentSongs = new Audio();
let songs;

function formatSeconds(seconds) {
    if(isNaN(seconds)||seconds<0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Pad single-digit minutes and seconds with a leading zero
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

const fetchSongs = async () => {
    const a = await fetch("/songs");
    const response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
const playMusic = (track, pause = false) => {
    currentSongs.src = `/songs/${track}`;
    if (!pause) {
        currentSongs.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track);
    document.querySelector(".current-time").innerHTML = "00:00";
    document.querySelector(".song-duration").innerHTML = "04:00";

};
const main = async () =>{
    songs = await fetchSongs()
    playMusic(songs[0],true)
    let songUL = document.querySelector(".songLists").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + 
        `<li>
            <img class="music" src="img/music.svg" alt="music">
            <div class="info">
                <div>${song.replaceAll("%20"," ")}</div>
                <div>Shubham</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img id="play-button" src="img/play-button.svg" alt="play">
            </div>
        </li>`;
    }
    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    playit.addEventListener("click",()=>{
        if(currentSongs.paused){
            currentSongs.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSongs.pause()
            play.src = "img/play.svg"
        }
    })
    currentSongs.addEventListener("timeupdate",()=>{
        document.querySelector(".current-time").innerHTML = `${
            formatSeconds(currentSongs.currentTime)
        }`
        document.querySelector(".song-duration").innerHTML = `${
            formatSeconds(currentSongs.duration)
        }`
        document.querySelector(".circle").style.left = (currentSongs.currentTime/currentSongs.duration)*100+"%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = (percent/100)*currentSongs.duration;
    })
    document.querySelector("#hamburger").addEventListener("click", () => {
        const hamburgerIcon = document.querySelector("#hamburger");
        
        // Toggle the source of the image between hamburger and cross
        if (hamburgerIcon.src.includes("hamburger.svg")) {
            hamburgerIcon.src = "img/cross.svg"; // Change to cross icon
            document.querySelector(".left").style.left = 0; // Show menu
        } else {
            hamburgerIcon.src = "img/hamburger.svg"; // Change back to hamburger icon
            document.querySelector(".left").style.left = "-100%"; // Hide menu
        }
    })
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })
    forward.addEventListener("click",()=>{
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSongs.volume = parseInt(e.target.value)/100
    })
    
}
main()