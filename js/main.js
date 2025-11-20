// registrando o service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      let reg = await navigator.serviceWorker.register("/sw.js", {
        type: "module",
      });
      console.log("Service worker registrado! 😎", reg);
    } catch (err) {
      console.log("😢 Service worker registro falhou: ", err);
    }
  });
}

// ----- CONFIGURAÇÃO DA CÂMERA -----

let currentFacing = "user"; // começa com a câmera frontal
let stream = null;

// capturando os elementos em tela
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  trocarCam = document.querySelector("#trocar--cam");

// inicia a câmera
async function cameraStart() {
  // se já existe um stream, parar
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacing },
      audio: false,
    });

    cameraView.srcObject = stream;
  } catch (error) {
    console.error("Ocorreu um erro ao iniciar a câmera:", error);
  }
}

// alternar câmera
async function toggleCamera() {
  currentFacing = currentFacing === "user" ? "environment" : "user";
  await cameraStart();
}

// tirar foto
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

// botão de trocar câmera
trocarCam.onclick = function () {
  toggleCamera();
};

// inicia tudo ao carregar
window.addEventListener("load", cameraStart, false);
