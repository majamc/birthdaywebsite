//Celebration button
const button = document.getElementById("btn-clickme");
const canvas = document.getElementById("confetti");

//Photobooth section
const photoboothBtn = document.getElementById("photobooth-btn");
const div1 = document.getElementById("div1");
const div2 = document.getElementById("div2");

const jsConfetti = new JSConfetti();

button.addEventListener('click',()=>{
    jsConfetti.addConfetti();
})

photoboothBtn.addEventListener('click',()=>{
    //click here photobooth btn
    div1.classList.add('hidden');
    div1.classList.remove('visible');
    div2.classList.add('visible');
    div2.classList.remove('hidden');
})


//Js for photobooth
var video = document.getElementById("video");
var video2 = document.getElementById("video2");
var overlay1 = document.getElementById("overlay1");
var overlay2 = document.getElementById("overlay2");
var photoStrip = document.getElementById("photo-strip");
var captureBtn = document.getElementById("capture-btn");
var downloadBtn = document.getElementById("download-btn");

// Access the camera and stream to both videos
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video2.srcObject = stream;
});

// Countdown helper
function countdownOnOverlay(seconds, overlay) {
  return new Promise((resolve) => {
    let counter = seconds;
    captureBtn.disabled = true;
    overlay.style.display = "flex";
    overlay.textContent = counter;

    const interval = setInterval(() => {
      counter--;
      if (counter > 0) {
        overlay.textContent = counter;
      } else {
        clearInterval(interval);
        overlay.style.display = "none";
        captureBtn.disabled = false;
        resolve();
      }
    }, 1000);
  });
}

// Capture a video frame and return an Image element that matches the displayed size
function captureFrame(videoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext("2d");
 
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.src = canvas.toDataURL("image/png");

  // Match displayed size
  img.style.width = videoElement.offsetWidth + "px";
  img.style.height = videoElement.offsetHeight + "px";
  img.style.objectFit = window.getComputedStyle(videoElement).objectFit || "cover";

  return img;
}

captureBtn.addEventListener("click", async () => {
  // 1️⃣ Countdown for first video
  await countdownOnOverlay(3, overlay1);

  // Freeze first video
  const frozenFrame1 = captureFrame(video);
  const parent1 = video.parentNode;
  parent1.replaceChild(frozenFrame1, video);

  // 2️⃣ Countdown for second video
  await countdownOnOverlay(3, overlay2);

  // Capture second video frame
  const frozenFrame2 = captureFrame(video2);
  const parent2 = video2.parentNode;
  parent2.replaceChild(frozenFrame2, video2);

  // 3️⃣ Capture final photo-strip as a single downloadable image
html2canvas(photoStrip, { useCORS: true, scale: 2 }).then((canvas) => {
    finalDataURL = canvas.toDataURL("image/png");

    // Show download button next to Capture
    downloadBtn.style.display = "inline-block";
  });

});

downloadBtn.addEventListener("click", () => {
  if (!finalDataURL) return;
  const a = document.createElement("a");
  a.href = finalDataURL;
  a.download = "birthday-photobooth.png";
  a.click();
});