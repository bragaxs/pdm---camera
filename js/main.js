// registrando o service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register("/sw.js", {
        type: "module",
      });
      console.log("Service worker registrado! 😎", reg);
    } catch (err) {
      console.log("😢 Service worker registro falhou: ", err);
    }
  });
}

// configurando as constraints do video stream
var constraints = { video: { facingMode: "user" }, audio: false };

// Função para trocar entre câmera frontal e traseira
function toggleCamera() {
  if (constraints.video.facingMode === "user") {
    constraints = { video: { facingMode: "environment" }, audio: false };
  } else {
    constraints = { video: { facingMode: "user" }, audio: false };
  }
}

// capturando os elementos em tela
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  trocarCam = document.querySelector("#trocar--cam");

// Função para iniciar a câmera
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Ocorreu um erro.", error);
    });
}

// Função para tirar foto
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

// Botão para trocar a câmera
trocarCam.onclick = function () {
  toggleCamera();
  cameraStart();
};

// Carrega a câmera quando a página abrir
window.addEventListener("load", cameraStart, false);
