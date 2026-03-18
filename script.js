// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

function initParticlesAnimation(){
    const container = document.getElementById('particles-js');
    if(!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    container.innerHTML = '';
    container.appendChild(canvas);

    const particles = [];
    const maxDistance = 150;
    let width = 0;
    let height = 0;
    let particleCount = 0;
    const mouse = {
        x: -9999,
        y: -9999,
        active: false
    };

    function resizeCanvas(){
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        particleCount = Math.max(80, Math.floor((width * height) / 11000));

        while(particles.length < particleCount){
            particles.push(createParticle());
        }
        particles.length = particleCount;
    }

    function createParticle(){
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4.4,
            vy: (Math.random() - 0.5) * 4.4,
            size: 2.6 + Math.random() * 3.2
        };
    }

    function addParticles(count, x, y){
        for(let i = 0; i < count; i++){
            particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 5.2,
                vy: (Math.random() - 0.5) * 5.2,
                size: 2.6 + Math.random() * 3.2
            });
        }
    }

    function draw(){
        ctx.clearRect(0, 0, width, height);

        for(let i = 0; i < particles.length; i++){
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if(mouse.active){
                const mx = p.x - mouse.x;
                const my = p.y - mouse.y;
                const md = Math.hypot(mx, my);
                const influenceRadius = 200;
                if(md > 0 && md < influenceRadius){
                    const force = (1 - md / influenceRadius) * 0.28;
                    p.vx += (mx / md) * force;
                    p.vy += (my / md) * force;
                }
            }

            p.vx *= 0.99;
            p.vy *= 0.99;
            p.vx = Math.max(-6.2, Math.min(6.2, p.vx));
            p.vy = Math.max(-6.2, Math.min(6.2, p.vy));

            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 245, 245, 0.9)';
            ctx.fill();

            for(let j = i + 1; j < particles.length; j++){
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.hypot(dx, dy);

                if(dist < maxDistance){
                    const alpha = (1 - dist / maxDistance) * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        window.requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    window.addEventListener('click', (event) => {
        addParticles(4, event.clientX, event.clientY);
        if(particles.length > particleCount + 60){
            particles.splice(0, particles.length - (particleCount + 60));
        }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();
}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initParticlesAnimation);
} else {
    initParticlesAnimation();
}