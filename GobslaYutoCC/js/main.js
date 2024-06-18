(async () => {
  /**
   * オプションを取得
   * @param {string} characterSheetID
   * @returns {{string: any}}
   */
  const getOptions = characterSheetID => {
    // localsに含まれる設定はキャラクターごと
    const locals = ['parry', 'spell_maint_']
    // optionsを生成
    const options = { [characterSheetID]: {}, global: {} }
    Array.from(document.querySelectorAll('#gycc input')).forEach(elm => {
      const id = elm.id.replace(/gycc_/, '')
      const type = elm.type
      const value = (/checkbox/.test(type)) ? elm.checked : elm.value
      // localsの対象はキャラクターIDに振り分け
      const filtered = locals.filter(local => new RegExp(local).test(id))
      if (filtered.length) {
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

  const manifestFile = chrome.runtime.getManifest()
  document.getElementById('version').innerText = manifestFile.version

  const gsjs = chrome.runtime.getURL('js/gs.js')
  const { GS } = await import(gsjs)
  const gs = new GS()

  // 受け流しがある場合、記入欄を追加
  if (gs.getSkillsMaxValue(['受け流し'])) {
    const parryParentElm = document.getElementById('gycc_parry')
    parryParentElm.disabled = false
  }

  // 呪文の設定
  gs.getSpellsArray().forEach(obj => {
    const name = obj.name
    const html = `
    <div>
      <p>${name}</p>
      <div>
        <input type="checkbox" id="gycc_spell_maint_${name}" />
        <label for="gycc_spell_maint_${name}">〈呪文維持判定〉</label>
      </div>
      <div class="flex justify-between">
        <label for="gycc_spell_bonus_${name}">ボーナス</label>
        <input type="number" id="gycc_spell_bonus_${name}" value="0">
      </div>
    </div>`
    document.querySelector('[data-slells]').insertAdjacentHTML('beforeend', html)
  })

  // 設定を読み込み
  const characterSheetID = new URL(location.href).searchParams.get('id')
  chrome.storage.sync.get().then((options) => {
    console.log('[GYCC] - get - options:', options)
    const setOptions = opt => {
      if (opt == null) return
      Object.keys(opt).forEach((key) => {
        const value = opt[key]
        const elm = document.querySelector(`#gycc_${key}`)
        if (elm == null) return
        if (typeof value === 'boolean') {
          elm.checked = value
        } else {
          elm.value = value
        }
      })
    }
    const localOptions = options[characterSheetID]
    const globalOptions = options.global
    setOptions(localOptions)
    setOptions(globalOptions)
  })

  const buttonElm = document.querySelector('#gycc .btn')
  buttonElm.addEventListener('click', e => {
    const options = getOptions(characterSheetID)
    chrome.storage.sync.set(options)
    console.log('[GYCC] - set - options:', options)
    const gsOptions = { ...options.global, ...options[characterSheetID] }
    try {
      const json = gs.getJson(gsOptions)
      console.log('[GYCC] - object:', JSON.parse(json))
      navigator.clipboard.writeText(json).then(
        () => alert('[GYCC] クリップボードにコピーしました👍\n\nココフォリアにペーストすることで駒を作成できます。'),
        () => alert(`[GYCC] クリップボードへのコピーに失敗しました😭\n\nブラウザの再起動など試してください。`)
      )
    } catch (error) {
      console.log('[GYCC] - error:', error)
      alert(`[GYCC] 駒の作成に失敗しました😭\n\nerror: ${error}`)
    }
  })

  const clearElm = document.getElementById('gycc_storageClear')
  clearElm.addEventListener('click', e => chrome.storage.sync.clear().then(_ => {
    alert('[GYCC] 設定を削除しました。')
    location.reload()
  }))
})()
