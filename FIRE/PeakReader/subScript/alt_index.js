export async function fetchLatestAltIndex() {
  try {
    const response = await fetch(
      'https://mn39back-6568d6a9ffe2.herokuapp.com/latest'
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('✅ 최신 Altcoin Index:', data);
  } catch (err) {
    console.error('❌ fetch 실패:', err.message);
  }
}
