(() => {
  const defaultCenter = { lat: 37.5519, lng: 126.9918 };
  const dashboardShell = document.getElementById('dashboardShell');
  const leftPanelToggle = document.getElementById('leftPanelToggle');
  const rightPanelToggle = document.getElementById('rightPanelToggle');
  const panelCloseButtons = document.querySelectorAll('[data-close-panel]');
  const peopleList = document.getElementById('peopleList');
  const profileHero = document.getElementById('profileHero');
  const onlineCount = document.getElementById('onlineCount');
  const searchInput = document.getElementById('searchInput');
  const emotionWheel = document.getElementById('emotionWheel');
  const composerCard = document.getElementById('composerCard');
  const bubbleForm = document.getElementById('bubbleForm');
  const bubbleInput = document.getElementById('bubbleInput');
  const activeEmotionLabel = document.getElementById('activeEmotionLabel');
  const locateButton = document.getElementById('locateButton');
  const closeComposer = document.getElementById('closeComposer');
  const syncPill = document.getElementById('syncPill');
  const roomChannel = typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('pulse-map-room')
    : null;
  const remoteVisitors = new Map();
  const presenceTtlMs = 12000;

  const emotions = [
    { key: 'joy', emoji: '🙂', label: '기쁨', color: 'linear-gradient(135deg, rgba(253, 224, 71, 0.86), rgba(251, 146, 60, 0.78))' },
    { key: 'love', emoji: '💖', label: '설렘', color: 'linear-gradient(135deg, rgba(251, 207, 232, 0.92), rgba(251, 113, 133, 0.72))' },
    { key: 'spark', emoji: '✨', label: '신남', color: 'linear-gradient(135deg, rgba(196, 181, 253, 0.92), rgba(125, 211, 252, 0.76))' },
    { key: 'hot', emoji: '🔥', label: '열정', color: 'linear-gradient(135deg, rgba(253, 186, 116, 0.9), rgba(248, 113, 113, 0.78))' },
    { key: 'calm', emoji: '☕', label: '여유', color: 'linear-gradient(135deg, rgba(167, 243, 208, 0.94), rgba(45, 212, 191, 0.7))' },
    { key: 'dream', emoji: '🌙', label: '잔잔', color: 'linear-gradient(135deg, rgba(216, 180, 254, 0.9), rgba(165, 180, 252, 0.76))' },
    { key: 'focus', emoji: '🧠', label: '집중', color: 'linear-gradient(135deg, rgba(147, 197, 253, 0.9), rgba(191, 219, 254, 0.78))' }
  ];

  const demoCrowd = [
    { id: 'mina-demo', name: 'Mina', latOffset: 0.006, lngOffset: 0.009, emotion: 'joy', message: '한강 근처 산책 중' },
    { id: 'joon-demo', name: 'Joon', latOffset: -0.005, lngOffset: -0.012, emotion: 'calm', message: '작업하다가 잠깐 쉬는 중' },
    { id: 'soo-demo', name: 'Soo', latOffset: 0.011, lngOffset: -0.004, emotion: 'love', message: '벚꽃 보러 갈 사람?' },
    { id: 'ara-demo', name: 'Ara', latOffset: -0.009, lngOffset: 0.011, emotion: 'dream', message: '조용한 카페 추천해줘' }
  ];

  const state = {
    self: {
      id: window.localStorage.getItem('pulse-map-user-id') || `pulse-${crypto.randomUUID()}`,
      name: window.localStorage.getItem('pulse-map-user-name') || `Guest ${Math.floor(100 + Math.random() * 900)}`,
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
      emotion: 'spark',
      message: '오늘은 꽤 좋은 하루야',
      initials: 'ME',
      isSelf: true,
      updatedAt: Date.now()
    },
    selectedUserId: null,
    wheelOpen: false,
    markers: new Map(),
    users: new Map(),
    heartbeatTimer: null
  };

  window.localStorage.setItem('pulse-map-user-id', state.self.id);
  window.localStorage.setItem('pulse-map-user-name', state.self.name);

  const map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([defaultCenter.lat, defaultCenter.lng], 13);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  function getEmotion(key) {
    return emotions.find((item) => item.key === key) || emotions[0];
  }

  function escapeHtml(value) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');
  }

  function upsertUser(user) {
    state.users.set(user.id, user);
  }

  function removeUser(id) {
    state.users.delete(id);
  }

  function getVisibleUsers() {
    return Array.from(state.users.values()).sort((a, b) => {
      if (a.isSelf) return -1;
      if (b.isSelf) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  function getSelectedUser() {
    return state.users.get(state.selectedUserId) || state.self;
  }

  function gradientClass(key) {
    return `emotion-accent-${key}`;
  }

  function markerHtml(user, isSelf) {
    const emotion = getEmotion(user.emotion);
    const bubble = user.message
      ? `<div class="marker-bubble">${escapeHtml(user.message)}</div>`
      : '';

    return `
      <div class="marker-shell ${isSelf ? 'is-self' : ''}" style="--accent-color:${emotion.color}">
        ${bubble}
        <div class="marker-meta">
          <span class="emoji">${emotion.emoji}</span>
          <span>${escapeHtml(user.name)}</span>
        </div>
        <div class="avatar-pin">
          <div class="avatar-ring"></div>
          <div class="avatar-core">${isSelf ? user.initials : initials(user.name)}</div>
        </div>
      </div>
    `;
  }

  function markerIcon(user, isSelf) {
    return L.divIcon({
      className: 'presence-icon',
      html: markerHtml(user, isSelf),
      iconSize: [220, 196],
      iconAnchor: [110, 182]
    });
  }

  function renderPeopleList() {
    const query = searchInput.value.trim().toLowerCase();
    const users = getVisibleUsers().filter((user) => {
      if (!query) return !user.isSelf;
      return user.name.toLowerCase().includes(query) || user.message.toLowerCase().includes(query);
    });

    onlineCount.textContent = String(state.users.size);

    peopleList.innerHTML = users
      .filter((user) => !user.isSelf)
      .map((user) => {
        const emotion = getEmotion(user.emotion);
        return `
          <button class="person-item ${state.selectedUserId === user.id ? 'is-active' : ''}" data-user-select="${user.id}" type="button">
            <div class="person-row">
              <div class="avatar-badge ${gradientClass(user.emotion)}">${escapeHtml(user.name[0])}</div>
              <div class="person-meta">
                <strong>${escapeHtml(user.name)}</strong>
                <p>${escapeHtml(user.message || '아직 남긴 메시지가 없어요.')}</p>
              </div>
              <span class="person-status">${emotion.label}</span>
            </div>
          </button>
        `;
      })
      .join('');

    if (!peopleList.innerHTML) {
      peopleList.innerHTML = '<div class="person-item"><div class="person-meta"><strong>검색 결과 없음</strong><p>다른 이름이나 분위기로 찾아보세요.</p></div></div>';
    }
  }

  function renderProfile() {
    const user = getSelectedUser();
    const emotion = getEmotion(user.emotion);
    profileHero.innerHTML = `
      <div class="profile-badge">
        <span>${emotion.emoji}</span>
        <span>${emotion.label}</span>
      </div>
      <div class="profile-identity">
        <div class="profile-avatar ${gradientClass(user.emotion)}">${escapeHtml(user.name[0])}</div>
        <div>
          <strong>${escapeHtml(user.name)}</strong>
          <p>${user.isSelf ? '현재 나의 위치' : 'Seoul live area'}</p>
        </div>
      </div>
      <div class="profile-copy">
        <p>${escapeHtml(user.message || '아직 남긴 메시지가 없어요.')}</p>
      </div>
      <div class="profile-meta">
        <span>📍</span>
        <span>${user.lat.toFixed(3)}, ${user.lng.toFixed(3)}</span>
      </div>
    `;
  }

  function updateStatusCard() {
    activeEmotionLabel.textContent = `${getEmotion(state.self.emotion).label} mode`;
  }

  function updateSyncPill(hasPeers = false) {
    syncPill.textContent = hasPeers ? 'Multi-tab sync active' : 'Local room sync';
  }

  function renderPanels() {
    renderPeopleList();
    renderProfile();
  }

  function selectUser(userId, options = {}) {
    if (!state.users.has(userId)) return;

    state.selectedUserId = userId;
    renderPanels();

    if (options.focusMap !== false) {
      const user = state.users.get(userId);
      map.flyTo([user.lat, user.lng], map.getZoom(), {
        animate: true,
        duration: 0.8
      });
    }

    if (window.matchMedia('(max-width: 980px)').matches) {
      dashboardShell.classList.remove('left-open');
      dashboardShell.classList.add('right-open');
    }
  }

  function openComposer() {
    composerCard.classList.add('visible');
    window.setTimeout(() => bubbleInput.focus(), 120);
  }

  function closeAllOverlays() {
    emotionWheel.classList.add('hidden');
    emotionWheel.setAttribute('aria-hidden', 'true');
    state.wheelOpen = false;
  }

  function removeMarker(id) {
    const marker = state.markers.get(id);
    if (!marker) return;
    marker.remove();
    state.markers.delete(id);
  }

  function addPerson(user) {
    upsertUser(user);

    const marker = L.marker([user.lat, user.lng], {
      icon: markerIcon(user, Boolean(user.isSelf)),
      riseOnHover: true,
      bubblingMouseEvents: false
    }).addTo(map);

    marker.on('click', () => {
      selectUser(user.id, { focusMap: false });

      if (user.isSelf) {
        openWheel(marker.getLatLng());
      } else {
        closeAllOverlays();
      }
    });

    state.markers.set(user.id, marker);
    renderPanels();
  }

  function updateMarker(user) {
    upsertUser(user);
    const marker = state.markers.get(user.id);

    if (!marker) {
      addPerson(user);
      return;
    }

    marker.setLatLng([user.lat, user.lng]);
    marker.setIcon(markerIcon(user, Boolean(user.isSelf)));
    renderPanels();
  }

  function renderWheel() {
    emotionWheel.innerHTML = '';

    emotions.slice(0, 6).forEach((emotion, index) => {
      const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
      const radius = 74;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<span>${emotion.emoji}</span><strong>${emotion.label}</strong>`;
      button.style.transform = `translate(${x}px, ${y}px)`;
      button.addEventListener('click', () => {
        state.self = {
          ...state.self,
          emotion: emotion.key,
          updatedAt: Date.now()
        };
        updateMarker(state.self);
        updateStatusCard();
        closeAllOverlays();
        broadcastPresence();
      });
      emotionWheel.appendChild(button);
    });
  }

  function openWheel(latlng) {
    const point = map.latLngToContainerPoint(latlng);
    emotionWheel.style.left = `${point.x}px`;
    emotionWheel.style.top = `${point.y + 28}px`;
    emotionWheel.classList.remove('hidden');
    emotionWheel.setAttribute('aria-hidden', 'false');
    state.wheelOpen = true;
    openComposer();
  }

  function updateSelfPosition(lat, lng, shouldPan = true) {
    state.self = {
      ...state.self,
      lat,
      lng,
      updatedAt: Date.now()
    };
    updateMarker(state.self);

    if (shouldPan) {
      map.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1
      });
    }
  }

  function showDemoCrowd(center) {
    demoCrowd.forEach((person) => {
      if (state.markers.has(person.id)) return;

      addPerson({
        id: person.id,
        name: person.name,
        lat: center.lat + person.latOffset,
        lng: center.lng + person.lngOffset,
        emotion: person.emotion,
        message: person.message,
        updatedAt: Date.now()
      });
    });
  }

  function clearDemoCrowd() {
    demoCrowd.forEach((person) => {
      removeMarker(person.id);
      removeUser(person.id);
    });
    renderPanels();
  }

  function receivePresence(visitor) {
    if (!visitor || visitor.id === state.self.id) return;

    remoteVisitors.set(visitor.id, visitor);
    clearDemoCrowd();
    updateMarker(visitor);
    updateSyncPill(remoteVisitors.size > 0);
  }

  function pruneRemoteVisitors() {
    const now = Date.now();

    for (const [id, visitor] of remoteVisitors.entries()) {
      if (now - visitor.updatedAt > presenceTtlMs) {
        remoteVisitors.delete(id);
        removeMarker(id);
        removeUser(id);
      }
    }

    if (!state.users.has(state.selectedUserId)) {
      state.selectedUserId = state.self.id;
    }

    if (remoteVisitors.size === 0) {
      updateSyncPill(false);
      showDemoCrowd({ lat: state.self.lat, lng: state.self.lng });
    }

    renderPanels();
  }

  function broadcastPresence() {
    const payload = {
      type: 'presence',
      visitor: {
        id: state.self.id,
        name: state.self.name,
        lat: state.self.lat,
        lng: state.self.lng,
        emotion: state.self.emotion,
        message: state.self.message,
        isSelf: false,
        updatedAt: Date.now()
      }
    };

    roomChannel?.postMessage(payload);
    window.localStorage.setItem('pulse-map-presence', JSON.stringify(payload));
  }

  function startPresenceLoop() {
    broadcastPresence();
    state.heartbeatTimer = window.setInterval(() => {
      broadcastPresence();
      pruneRemoteVisitors();
    }, 4000);
  }

  function locateSelf() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateSelfPosition(position.coords.latitude, position.coords.longitude);
        broadcastPresence();
      },
      () => {
        updateSelfPosition(defaultCenter.lat, defaultCenter.lng, false);
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 60000
      }
    );
  }

  function togglePanel(side) {
    if (side === 'left') {
      dashboardShell.classList.toggle('left-open');
      dashboardShell.classList.remove('right-open');
      return;
    }

    dashboardShell.classList.toggle('right-open');
    dashboardShell.classList.remove('left-open');
  }

  leftPanelToggle.addEventListener('click', () => togglePanel('left'));
  rightPanelToggle.addEventListener('click', () => togglePanel('right'));

  panelCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      dashboardShell.classList.remove(`${button.dataset.closePanel}-open`);
    });
  });

  peopleList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-user-select]');
    if (!button) return;
    selectUser(button.dataset.userSelect);
  });

  searchInput.addEventListener('input', renderPeopleList);

  roomChannel?.addEventListener('message', (event) => {
    if (event.data?.type === 'presence') {
      receivePresence(event.data.visitor);
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== 'pulse-map-presence' || !event.newValue) return;

    try {
      const payload = JSON.parse(event.newValue);
      if (payload.type === 'presence') {
        receivePresence(payload.visitor);
      }
    } catch (error) {
      // Ignore malformed payloads from other tabs.
    }
  });

  bubbleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextMessage = bubbleInput.value.trim();

    if (!nextMessage) return;

    state.self = {
      ...state.self,
      message: nextMessage,
      updatedAt: Date.now()
    };
    updateMarker(state.self);
    bubbleInput.value = '';
    broadcastPresence();
  });

  locateButton.addEventListener('click', locateSelf);

  closeComposer.addEventListener('click', () => {
    composerCard.classList.remove('visible');
  });

  map.on('click', () => {
    closeAllOverlays();
    composerCard.classList.remove('visible');
  });

  map.on('move', () => {
    if (!state.wheelOpen) return;
    openWheel(L.latLng(state.self.lat, state.self.lng));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllOverlays();
      composerCard.classList.remove('visible');
      dashboardShell.classList.remove('left-open', 'right-open');
    }
  });

  window.addEventListener('beforeunload', () => {
    roomChannel?.close();
  });

  addPerson(state.self);
  showDemoCrowd(defaultCenter);
  state.selectedUserId = state.self.id;
  updateStatusCard();
  updateSyncPill(false);
  renderWheel();
  renderPanels();
  startPresenceLoop();
  locateSelf();
})();
