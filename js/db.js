let db;

const request = indexedDB.open("diarioFotos", 1);

request.onupgradeneeded = event => {
  db = event.target.result;
  db.createObjectStore("fotos", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = event => {
  db = event.target.result;
};

request.onerror = () => console.log("Erro no IndexedDB");

function salvarFoto(data) {
  return new Promise(resolve => {
    const tx = db.transaction("fotos", "readwrite");
    tx.objectStore("fotos").add({ data });
    tx.oncomplete = () => resolve();
  });
}

function listarFotos() {
  return new Promise(resolve => {
    const tx = db.transaction("fotos", "readonly");
    const req = tx.objectStore("fotos").getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

