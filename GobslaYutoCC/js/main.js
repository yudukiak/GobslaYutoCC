(async () => {
  /**
   * オプションを取得
   * @param {string} characterSheetID
   * @returns {{string: any}}
   */
  const getOptions = characterSheetID => {
    // localに含まれる設定はキャラクターごと
    const local = ['parry']
    // optionsを生成
    const options = {[characterSheetID]:{}, global:{}}
    Array.from(document.querySelectorAll('#gycc input')).forEach(elm => {
      const id = elm.id.replace(/gycc_/, '')
      const type = elm.type
      const value = (/checkbox/.test(type)) ? elm.checked : elm.value
      // localの対象はキャラクターIDに振り分け
      if (local.includes(id)) {
        options[characterSheetID][id] = value
      } else {
        options.global[id] = value
      }
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
    const parryParentElm = document.getElementById('gycc_parry')
    parryParentElm.disabled = false
  }

  // 設定を読み込み
  const characterSheetID = new URL(location.href).searchParams.get('id')
  let chromeStorageOptions = null
  chrome.storage.sync.get().then((items) => {
    chromeStorageOptions = items
    const setOptions = options => {
      if (options == null) return
      Object.keys(options).forEach((key) => {
        const value = options[key]
        if (typeof value === 'boolean') {
          document.querySelector(`#gycc_${key}`).checked = value
        } else {
          document.querySelector(`#gycc_${key}`).value = value
        }
      })
    }
    const localOptions = items[characterSheetID]
    const globalOptions = items.global
    setOptions(localOptions)
    setOptions(globalOptions)
  })

  const buttonElm = document.querySelector('#gycc .btn')
  buttonElm.addEventListener('click', e => {
    const options = getOptions(characterSheetID)
    chrome.storage.sync.set(options)
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
