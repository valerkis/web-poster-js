document.addEventListener("DOMContentLoaded", function () {

  // переключение главных секций
  const sections = document.querySelectorAll(".section");
  const forwardButtons = document.querySelectorAll(".forward");
  const backButtons = document.querySelectorAll(".back");

  function hideAllSections() {
      sections.forEach(section => section.classList.remove("active"));
  }

  forwardButtons.forEach(button => {
      button.addEventListener("click", () => {
          const activeSection = document.querySelector(".section.active");
          let nextSection = activeSection.nextElementSibling || sections[0];

          hideAllSections();
          nextSection.classList.add("active");
      });
  });

  backButtons.forEach(button => {
      button.addEventListener("click", () => {
          const activeSection = document.querySelector(".section.active");
          let prevSection = activeSection.previousElementSibling || sections[sections.length - 1];

          hideAllSections();
          prevSection.classList.add("active");
      });
  });

  // переключение секций внутри sec3 
  const emotionButtons = document.querySelectorAll(".emotionBtn");
  const emotionSections = document.querySelectorAll(".emotionSection");

  function hideAllEmotionSections() {
      emotionSections.forEach(section => section.classList.remove("active"));
  }

  emotionButtons.forEach(button => {
      button.addEventListener("click", function () {
          const emotion = this.getAttribute("data-emotion");

          const sec3 = document.getElementById("sec3");
          if (!sec3.classList.contains("active")) {
          }

          hideAllEmotionSections();
          const selectedSection = document.getElementById(emotion);
          if (selectedSection) {
              selectedSection.classList.add("active");
              console.log("Теперь активна эмоция:", selectedSection.id);
          } else {
              console.error("Ошибка", emotion);
          }
      });
  });



// поп-апы
let buttons = document.querySelectorAll(".openBtn");
let popups = document.querySelectorAll(".popup");

if (buttons.length > 0 && popups.length > 0) {
  buttons.forEach(button => {
    button.addEventListener("click", function (event) {
      popups.forEach(popup => popup.style.display = "none");
      this.nextElementSibling.style.display = "block";
      event.stopPropagation();
    });
  });

  document.addEventListener("click", function (event) {
    popups.forEach(popup => {
      if (!popup.contains(event.target) && !event.target.classList.contains("openBtn")) {
        popup.style.display = "none";
      }
    });
  });
}

//  карта эмоций
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const section = document.getElementById("sec1");
const infoBox = document.getElementById("info");
const resetButton = document.getElementById("reset");

let fixedEmotion = null;

function resizeCanvas() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const emotions = [
  { name: "Печаль", angle: 0 },
  { name: "Гнев", angle: 45 },
  { name: "Активность", angle: 90 },
  { name: "Восхищение", angle: 135 },
  { name: "Радость", angle: 180 },
  { name: "Любовь", angle: 225 },
  { name: "Пассивность", angle: 270 },
  { name: "Страх", angle: 315 }
];

// эмоции между секторами
const complexEmotions = {
  "Активность-Восхищение": "Гордость",
  "Восхищение-Радость": "Воодушевление",
  "Радость-Любовь": "Страсть",
  "Любовь-Пассивность": "Умиротворение",
  "Пассивность-Страх": "Подавленность",
  "Страх-Печаль": "Тревога",
  "Печаль-Гнев": "Раздражение",
  "Гнев-Активность": "Бунт"
};

function getEmotionAtAngle(angle) {
  for (let i = 0; i < emotions.length; i++) {
    let nextIndex = (i + 1) % emotions.length;
    let startAngle = emotions[i].angle;
    let endAngle = emotions[nextIndex].angle;
    
    // сектор пересекает 360 градусов
    if (startAngle > endAngle) {
      endAngle += 360;
      if (angle < startAngle) angle += 360;
    }
    
    if (angle >= startAngle && angle < endAngle) {
      let percent = ((angle - startAngle) / (endAngle - startAngle)) * 100;
      let emotion1 = emotions[i].name;
      let emotion2 = emotions[nextIndex].name;
      let complexEmotion = complexEmotions[`${emotion1}-${emotion2}`] || complexEmotions[`${emotion2}-${emotion1}`];

      return {
        emotion1,
        emotion2,
        complexEmotion,
        percent1: (100 - percent).toFixed(0),
        percent2: percent.toFixed(0)
      };
    }
  }
  return null;
}
 // состояние зафиксировано, не обновляем
function updateInfo(event) {
  if (fixedEmotion) return;

  let rect = section.getBoundingClientRect();
  let offsetX = section.clientWidth * 0.013;
  let offsetY = section.clientHeight * 0.02;

  let x = event.clientX - rect.left - section.clientWidth / 2 + offsetX;
  let y = event.clientY - rect.top - section.clientHeight / 2 + offsetY;
  let angle = (Math.atan2(y, -x) * (-180 / Math.PI) + 360) % 360;
  let emotionData = getEmotionAtAngle(angle);

  if (emotionData) {
    infoBox.innerHTML = `
      <strong>${emotionData.complexEmotion}</strong><br>
      ${emotionData.emotion1} ${emotionData.percent1}%  ${emotionData.emotion2} ${emotionData.percent2}%
    `;
  }
}

section.addEventListener("mousemove", updateInfo);

section.addEventListener("click", (event) => {
  if (event.target.classList === "back" || event.target.c === "forward" || event.target.id === "openBtn") {
    return;
  }

  let rect = section.getBoundingClientRect();
  let offsetX = section.clientWidth * 0.03;
  let offsetY = section.clientHeight * 0.03;

  let x = event.clientX - rect.left - section.clientWidth / 2 + offsetX;
  let y = event.clientY - rect.top - section.clientHeight / 2 + offsetY;
  let angle = (Math.atan2(y, -x) * (-180 / Math.PI) + 360) % 360;
  fixedEmotion = getEmotionAtAngle(angle);

  if (fixedEmotion) {
    infoBox.innerHTML = `
      <strong>${fixedEmotion.complexEmotion}</strong><br>
      ${fixedEmotion.emotion1} ${fixedEmotion.percent1}%&nbsp;&nbsp;&nbsp;${fixedEmotion.emotion2} ${fixedEmotion.percent2}%
    `;
  }
});


// экран 2

// луч
const spotlight = document.getElementById("spotlight");

document.addEventListener("mousemove", (event) => {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    let x = event.clientX - centerX;
    let y = event.clientY - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    let colors = [
        " #FF4E43", // 0-60
        " #AAB079", // 60-120
        " #E04D5F", // 120-180
        " #7C7BC8", // 180-240
        " #7C7BC8", // 240-300
        " #D06882"  // 300-360
    ];

    let colorIndex = Math.floor(angle / 60);
    let selectedColor = colors[colorIndex];

    requestAnimationFrame(() => {
        spotlight.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        spotlight.style.background = `conic-gradient(
            rgba(33, 33, 33, 0) 0%, 
            rgba(33, 33, 33, 0) 16%, 
            ${selectedColor} 25%,
            rgba(33, 33, 33, 0) 34%, 
            rgba(33, 33, 33, 0) 100%
        )`;
    });
  });

// экран 3
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const prevBtn = document.getElementById("prevTrack");
const nextBtn = document.getElementById("nextTrack");
const trackList = document.querySelectorAll(".track");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

let currentTrackIndex = 0;
let audio = new Audio();
let isPlaying = false;



const tracks = Array.from(trackList).map(track => ({
  src: track.getAttribute("data-src") || track.getAttribute("src"),
  title: track.querySelector(".title").innerText.replace(/^\d+\.\s*/, ""), // Убираем номер и пробелы
  artist: track.querySelector(".artist").innerText
}));


function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;

    audio.pause();
    audio.currentTime = 0;

    audio.removeEventListener("ended", nextTrack);
    audio.removeEventListener("timeupdate", updateSeekBar);
    
    currentTrackIndex = index;
    audio.src = tracks[index].src;

    currentTitle.innerText = tracks[index].title;
    currentArtist.innerText = tracks[index].artist;
    seekBar.value = 0;

    audio.addEventListener("ended", nextTrack);
    audio.addEventListener("timeupdate", updateSeekBar);
    audio.addEventListener("loadedmetadata", () => {
        totalTimeEl.innerText = formatTime(audio.duration);
    });

    if (isPlaying) {
        playTrack();
    }
}

// плей
function playTrack() {
    if (!audio.src) loadTrack(currentTrackIndex);
    
    audio.play();
    isPlaying = true;

    playBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
}

// пауза
function pauseTrack() {    
    audio.pause();
    isPlaying = false;

    playBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
}

// переключение на следующий трек
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
}

// переключение на предыдущий трек
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
}

// обновление прогресса трека
function updateSeekBar() {
    if (audio.duration) {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.innerText = formatTime(audio.currentTime);
    }
}

// перемотка слайдером
seekBar.addEventListener("input", function () {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// форматирование времени
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// исключаем дублирование
function resetControls() {
    document.querySelectorAll("#controls button").forEach(button => {
        const newButton = button.cloneNode(true);
        button.replaceWith(newButton);
    });

    document.getElementById("playBtn").addEventListener("click", function () {
        isPlaying ? pauseTrack() : playTrack();
    });

    document.getElementById("pauseBtn").addEventListener("click", function () {
        pauseTrack();
    });

    document.getElementById("prevTrack").addEventListener("click", function () {
        prevTrack();
    });

    document.getElementById("nextTrack").addEventListener("click", function () {
        console.log("🎛 Нажата кнопка Next");
        nextTrack();
    });
}

// сброс кнопок и загрузка первого трека
resetControls();
loadTrack(currentTrackIndex);
});
// });
