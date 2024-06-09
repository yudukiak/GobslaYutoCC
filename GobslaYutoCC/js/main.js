(async () => {
  /**
   * オプションを取得
   * @returns {{string: any}}
   */
  const getOptions = _ => {
    const options = {}
    Array.from(document.querySelectorAll('#gycc input')).forEach(elm => {
      const id = elm.id.replace(/gycc_/, '')
      const type = elm.type
      const value = (/checkbox/.test(type)) ? elm.checked : elm.value
      options[id] = value
    })
    return options
  }

 const htmlFileURL = chrome.runtime.getURL('html/gyss.html')
 const htmlFile = await fetch(htmlFileURL)
 const html = await htmlFile.text()
  document.querySelector('.back-button').insertAdjacentHTML('afterend', html)

  const gsjs = chrome.runtime.getURL('js/gs.js')
  const { GS } = await import(gsjs)
  const gs = new GS()

  // 受け流しがある場合、記入欄を追加
  if (gs.getSkillsMaxValue(['受け流し'])) {
    const parryParentElm = document.getElementById('gycc_parry').parentNode
    parryParentElm.classList.remove('d-none')
    /*
    const htmlAry = gs.getWeaponsArray().map((object, index) => {
      const id = `gycc_parry${index}`
      const labelHtml = `<label for="${id}">${object.name}</label>` 
      const numberHtml = `<input type="number" id="${id}" value="0">`
      const divHtml = `<div>${labelHtml}${numberHtml}</div>`
      return divHtml
    })
    const htmlText = `<h2>受け流し</h2>${htmlAry.join('')}`
    document.querySelector('#gycc h2:last-of-type').insertAdjacentHTML('beforebegin', htmlText)
    */
  }

  const buttonElm = document.querySelector('#gycc .btn')
  buttonElm.addEventListener('click', e => {
    const options = getOptions()
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
