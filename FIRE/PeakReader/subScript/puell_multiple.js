// fetcher.js
export async function puell_multiple() {
  const proxy = 'https://corsproxy.io/?';

  const url =
    'https://www.bitcoinmagazinepro.com/django_plotly_dash/app/puell_multiple/_dash-update-component';

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
  };

  const body = JSON.stringify({
    output: 'chart.figure',
    outputs: { id: 'chart', property: 'figure' },
    inputs: [
      {
        id: 'url',
        property: 'pathname',
        value: '/charts/puell-multiple/',
      },
      { id: 'display', property: 'children', value: 'xl 1204px' },
    ],
    changedPropIds: ['display.children'],
  });

  try {
    const res = await fetch(proxy + url, {
      method: 'POST',
      headers,
      body,
    });

    const result = await res.json();
    console.log('✔ 푸엘 멀티플 응답:', result);
    return result;
  } catch (error) {
    console.error('❌ 요청 실패:', error.message);
    return null;
  }
}
