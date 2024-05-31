(async () => {
  const htmljs = chrome.runtime.getURL('js/html.js')
  const { HTML } = await import(htmljs)
  const html = new HTML()
  const buttonHtml = html.getButtonHtml()
  document.querySelector('.back-button').insertAdjacentHTML('afterend', buttonHtml)

  const gsjs = chrome.runtime.getURL('js/gs.js')
  const { GS } = await import(gsjs)
  const gs = new GS()

  const buttonElm = document.querySelector('#gycc .btn')
  buttonElm.addEventListener('click', e => {
    const options = {
      title: document.getElementById('gycc_title')?.checked,
      add: document.getElementById('gycc_add')?.checked,
      sup: document.getElementById('gycc_sup')?.checked
    }
    try {
      const json = gs.getJson(options)
      navigator.clipboard.writeText(json).then(
        () => alert('[GYCC] クリップボードにコピーしました👍\n\nココフォリアにペーストすることで駒を作成できます。'),
        () => alert(`[GYCC] クリップボードへのコピーに失敗しました😭\n\nブラウザの再起動など試してください。`)
      )
    } catch (error) {
      alert(`[GYCC] 駒の作成に失敗しました😭\n\nerror: ${error}`)
    }
  })
})()
