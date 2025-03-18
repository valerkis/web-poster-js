document.addEventListener("DOMContentLoaded", function () {

// переключение секций
const sections = document.querySelectorAll(".section");

const forwardButtons = document.querySelectorAll(".forward");
const backButtons = document.querySelectorAll(".back");

function hideAllSections() {
  sections.forEach(section => {
    section.classList.remove("active");
  });
}

// вперед
forwardButtons.forEach(button => {
  button.addEventListener("click", () => {
    const activeSection = document.querySelector(".section.active");
    let nextSection = activeSection.nextElementSibling;
    
    if (!nextSection) {
      nextSection = sections[0];
    }
    
    hideAllSections();
    nextSection.classList.add("active");
  });
});

// назад
backButtons.forEach(button => {
  button.addEventListener("click", () => {
    const activeSection = document.querySelector(".section.active");
    let prevSection = activeSection.previousElementSibling;

    if (!prevSection) {
      prevSection = sections[sections.length - 1];
    }

    hideAllSections();
    prevSection.classList.add("active");
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

// кнопка сброса
// resetButton.addEventListener("click", () => {
//   fixedEmotion = null;
//   infoBox.innerHTML = "";
// });

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

document.addEventListener("DOMContentLoaded", () => {
  const trackList = document.querySelectorAll(".track");
  const vinyl = document.getElementById("vinyl");
  const playPauseBtn = document.getElementById("playPause");
  const prevTrackBtn = document.getElementById("prevTrack");
  const nextTrackBtn = document.getElementById("nextTrack");
  const emotionButtons = document.querySelectorAll(".emotionBtn");
  const seekBar = document.getElementById("seekBar");
  let currentTrackIndex = 0;
  let audio = new Audio(trackList[currentTrackIndex].dataset.src);
  let isPlaying = false;

  function playTrack(index) {
      audio.src = trackList[index].dataset.src;
      document.getElementById("currentTitle").textContent = trackList[index].querySelector(".title").textContent;
      document.getElementById("currentArtist").textContent = trackList[index].querySelector(".artist").textContent;
      audio.play();
      isPlaying = true;
      playPauseBtn.style.backgroundImage = "url('img/pause.svg')";
      vinyl.style.animation = "spin 3s linear infinite";
  }

  function togglePlayPause() {
      if (isPlaying) {
          audio.pause();
          isPlaying = false;
          playPauseBtn.style.backgroundImage = "url('img/play.svg')";
          vinyl.style.animation = "none";
      } else {
          audio.play();
          isPlaying = true;
          playPauseBtn.style.backgroundImage = "url('img/pause.svg')";
          vinyl.style.animation = "spin 3s linear infinite";
      }
  }

  function nextTrack() {
      currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
      playTrack(currentTrackIndex);
  }

  function prevTrack() {
      currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
      playTrack(currentTrackIndex);
  }

  playPauseBtn.addEventListener("click", togglePlayPause);
  nextTrackBtn.addEventListener("click", nextTrack);
  prevTrackBtn.addEventListener("click", prevTrack);

  trackList.forEach((track, index) => {
      track.addEventListener("click", () => {
          currentTrackIndex = index;
          playTrack(currentTrackIndex);
      });
  });

  emotionButtons.forEach(button => {
      button.addEventListener("click", () => {
          let emotion = button.dataset.emotion;
          document.body.style.background = getEmotionGradient(emotion);
          updatePlaylistForEmotion(emotion);
      });
  });

  function getEmotionGradient(emotion) {
      const gradients = {
          anger: "linear-gradient(to bottom, #4d0000, #ff0000)",
          joy: "linear-gradient(to bottom, #ffcc00, #ff9900)",
          sadness: "linear-gradient(to bottom, #001a4d, #003366)",
          fear: "linear-gradient(to bottom, #330033, #660066)",
          love: "linear-gradient(to bottom, #ff0066, #ff3399)",
          admiration: "linear-gradient(to bottom, #666666, #999999)",
          passivity: "linear-gradient(to bottom, #336600, #669900)",
          activity: "linear-gradient(to bottom, #3300cc, #6600ff)"
      };
      return gradients[emotion] || "linear-gradient(to bottom, #000000, #333333)";
  }

  function updatePlaylistForEmotion(emotion) {
      const playlists = {
          anger: ["tracks/anger1.mp3", "tracks/anger2.mp3", "tracks/anger3.mp3", "tracks/anger4.mp3", "tracks/anger5.mp3"],
          joy: ["tracks/joy1.mp3", "tracks/joy2.mp3", "tracks/joy3.mp3", "tracks/joy4.mp3", "tracks/joy5.mp3"],
          // Добавь сюда остальные эмоции...
      };
      trackList.forEach((track, index) => {
          if (playlists[emotion]) {
              track.dataset.src = playlists[emotion][index];
          }
      });
      currentTrackIndex = 0;
      playTrack(currentTrackIndex);
  }
});
  });