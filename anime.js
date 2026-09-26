document.addEventListener('DOMContentLoaded', () => {
  const animeList = document.getElementById('animeList');
  const videoModal = document.getElementById('videoModal');
  const animePlayerFrame = document.getElementById('animePlayerFrame');
  const playingTitle = document.getElementById('playingTitle');
  const btnCloseVideo = document.getElementById('btnCloseVideo');

  if (!animeList) return;

  const daftarAnime = [
    { 
      title: "Solo Leveling", 
      eps: "Episode 1", 
      img: "https://i.pinimg.com/736x/8f/58/e3/8f58e37e9d724930db6fc3747fc32d84.jpg",
      videoUrl: "https://www.youtube.com/embed/9gnmt1_aPzs?autoplay=1" 
    },
    { 
      title: "Jujutsu Kaisen", 
      eps: "Episode 1", 
      img: "https://i.pinimg.com/736x/77/65/59/77655979803120cb95df572eb06f3db5.jpg",
      videoUrl: "https://www.youtube.com/embed/V4gfyK8wVzM?autoplay=1" 
    },
    { 
      title: "One Piece", 
      eps: "Episode 1000", 
      img: "https://i.pinimg.com/736x/29/db/d1/29dbd12d4d98ab34dfa8069502b489a2.jpg",
      videoUrl: "https://www.youtube.com/embed/MCb13lbK-bk?autoplay=1" 
    },
    { 
      title: "Demon Slayer", 
      eps: "Episode 1", 
      img: "https://i.pinimg.com/736x/67/7a/df/677adf29de6ec7a4f9dfab8e470870cb.jpg",
      videoUrl: "https://www.youtube.com/embed/VQGCKyvzIM4?autoplay=1" 
    }
  ];

  let htmlBox = '';
  daftarAnime.forEach((anime, index) => {
    htmlBox += `
      <div class="anime-card" onclick="putarAnime(${index})">
        <div class="anime-thumb" style="background-image: url('${anime.img}')"></div>
        <div class="anime-info">
          <div class="anime-title">${anime.title}</div>
          <div class="anime-eps">▶ ${anime.eps}</div>
        </div>
      </div>
    `;
  });

  animeList.innerHTML = htmlBox;

  window.putarAnime = function(index) {
    const selected = daftarAnime[index];
    if (selected && videoModal && animePlayerFrame) {
      playingTitle.innerText = `Memutar: ${selected.title} (${selected.eps})`;
      animePlayerFrame.src = selected.videoUrl;
      videoModal.style.display = "block";
      videoModal.scrollIntoView({ behavior: 'smooth' });
      showToast(`Memuat ${selected.title}...`, 'success');
    }
  };

  if (btnCloseVideo) {
    btnCloseVideo.addEventListener('click', () => {
      videoModal.style.display = "none";
      animePlayerFrame.src = "";
    });
  }
});
