document.addEventListener("DOMContentLoaded", function () {
  const userId = getCookie("userId");
  const token = getCookie("token");

  // Adicione esta função para obter a localização do navegador
  const getBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          registerPoint(position.coords.latitude, position.coords.longitude);
          initMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Erro ao obter a localização do navegador:", error);
          // Trate os erros conforme necessário
        }
      );
    } else {
      console.error("Geolocalização não suportada pelo navegador.");
      // Trate a falta de suporte à geolocalização conforme necessário
    }
  };

  // Chame a função getBrowserLocation no início do seu código para obter a localização inicial
  getBrowserLocation();
});

function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

function openMenu() {
  document.getElementById("menuModal").style.display = "flex";
}

function closeMenu() {
  document.getElementById("menuModal").style.display = "none";
}

function navigateTo(screen) {
  console.log("Navigating to", screen);
  closeMenu();
}

function downloadReceipt() {
  console.log("Downloading receipt");
}

// Atualize a função registerPoint para aceitar parâmetros de latitude e longitude
function registerPoint(latitude, longitude) {
  console.log("Registering point at", latitude, longitude);
  // Adicione aqui o código para enviar a requisição de registro de ponto com as coordenadas
}

// Adicione esta função para inicializar o mapa e obter a localização do navegador
function initMap(latitude, longitude) {
  if (navigator.geolocation) {
    const mapOptions = {
      center: {
        lat: latitude,
        lng: longitude,
      },
      zoom: 15,
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Adicione o marcador na localização do navegador
    const marker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude,
      },
      map: map,
      title: "Sua Localização",
    });
  } else {
    console.error("Geolocalização não suportada pelo navegador.");
    // Trate a falta de suporte à geolocalização conforme necessário
  }
}
