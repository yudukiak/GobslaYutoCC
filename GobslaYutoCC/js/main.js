(async () => {

 const htmlFileURL = chrome.runtime.getURL('html/gyss.html')
 const htmlFile = await fetch(htmlFileURL)
 const html = await htmlFile.text()
  document.querySelector('.back-button').insertAdjacentHTML('afterend', html)

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
      console.log('[GYCC] - error:', error)
      alert(`[GYCC] 駒の作成に失敗しました😭\n\nerror: ${error}`)
    }
  })
})()
