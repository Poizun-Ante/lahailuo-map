// =====================
// 定数
// =====================
const STORAGE_KEY = 'lahailuo_mobile_pins';
const mapWidth = 8192;
const mapHeight = 8192;

// =====================
// マップ初期化
// =====================
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -6,
  maxZoom: 6,
  zoomSnap: 0.25,
  zoomControl: false,
  tap: true
});

const bounds = [[0, 0], [mapHeight, mapWidth]];
L.imageOverlay('lahailuo.png', bounds).addTo(map);
map.fitBounds(bounds);

// =====================
// 状態
// =====================
let pins = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const layer = L.layerGroup().addTo(map);

// =====================
// 描画
// =====================
function renderPins(filter = '') {
  layer.clearLayers();

  pins.forEach(pin => {
    if (!pin.name.includes(filter)) return;

    const marker = L.marker(pin.latlng).addTo(layer);

    // タップで一時非表示
    marker.on('tap', () => {
      pin.hidden = !pin.hidden;
      savePins();
      renderPins(filter);
    });

    if (pin.hidden) marker.setOpacity(0.3);
  });
}

// =====================
// 保存
// =====================
function savePins() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
}

// =====================
// 長押しでピン追加
// =====================
let pressTimer = null;

map.on('mousedown touchstart', e => {
  pressTimer = setTimeout(() => {
    pins.push({
      id: Date.now(),
      name: `Pin-${pins.length + 1}`,
      latlng: e.latlng,
      hidden: false
    });
    savePins();
    renderPins();
  }, 600); // 長押し
});

map.on('mouseup touchend', () => {
  clearTimeout(pressTimer);
});

// =====================
// 検索
// =====================
document.getElementById('search').addEventListener('input', e => {
  renderPins(e.target.value);
});

// =====================
// 初期描画
// =====================
renderPins();
