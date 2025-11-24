// ----------------------------------------------------
// REGISTRANDO SERVICE WORKER
// ----------------------------------------------------
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

// ----------------------------------------------------
// CONFIGURAÇÕES DA CÂMERA
// ----------------------------------------------------
let constraints = { video: { facingMode: "user" }, audio: false };

// Trocar câmera
function toggleCamera() {
  constraints.video.facingMode =
    constraints.video.facingMode === "user"
      ? "environment"
      : "user";
}

// Elementos
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  trocarCam = document.querySelector("#trocar--cam"),
  galeria = document.querySelector("#galeria");

// ----------------------------------------------------
// INICIAR CÂMERA
// ----------------------------------------------------
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

// ----------------------------------------------------
// TIRAR FOTO
// ----------------------------------------------------
cameraTrigger.onclick = async function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");

  await salvarFoto(cameraOutput.src);
  carregarGaleria();
};

// ----------------------------------------------------
// BOTÃO TROCAR CÂMERA
// ----------------------------------------------------
trocarCam.onclick = function () {
  toggleCamera();
  cameraStart();
};

// ----------------------------------------------------
// GALERIA (IndexedDB)
// ----------------------------------------------------
async function carregarGaleria() {
  const fotos = await listarFotos();
  galeria.innerHTML = "";

  fotos.forEach(f => {
    const img = document.createElement("img");
    img.src = f.data;
    img.className = "foto";
    galeria.appendChild(img);
  });
}

// Iniciar
window.addEventListener("load", () => {
  cameraStart();
  carregarGaleria();
});
