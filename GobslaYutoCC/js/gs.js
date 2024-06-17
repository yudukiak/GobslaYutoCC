import { JL } from './judgmentList.js'

export class GS {

  /**
   * 「能力値」の配列を返す
   * @returns {{label: string, value: number}[]} {label: 能力名, value: 能力値}[] もしくは null
   */
  getAbilityArray() {
    // インスタンス変数に存在する場合は処理しない
    if (this.abilityArray) return this.abilityArray
    // 能力値を1つずつ処理
    const abilityAry = Array.from(document.querySelectorAll('#ability dt')).map(elm => {
      const labelTxt = elm.textContent
      const label = labelTxt.replace(/[点|度]/, '')
      const valueElm = elm.nextElementSibling.nextElementSibling
      // 第一+第二はnullを返す
      if (valueElm == null) return null
      const valueTxt = valueElm.textContent
      const value = Number(valueTxt)
      const obj = { label: label, value: value }
      return obj
    })
    // nullを除外
    const abilityArray = abilityAry.filter(Boolean)
    // インスタンス変数に保存
    this.abilityArray = abilityArray
    return abilityArray
  }

  /**
   * 指定された「能力値」の配列を返す
   * @param {string[]} sendAbilityArray 能力名の配列[]
   * @returns {{label: string, value: number}[]} {label: 能力名, value: 能力値}[] もしくは null
   */
  getAbilityValues(sendAbilityArray) {
    if (sendAbilityArray == null) return
    const abilityArray = this.getAbilityArray()
    const abilityValues = []
    sendAbilityArray.forEach(label => {
      abilityArray.forEach(abilityObject => {
        if (abilityObject.label === label) abilityValues.push(abilityObject)
      })
    })
    if (!abilityValues.length) return null
    return abilityValues
  }

  /**
   * 「職業」の配列を返す
   * @returns {{label: string, value: number}[]} {label: 職業, value: レベル}[] もしくは null
   */
  getClassesArray() {
    // インスタンス変数に存在する場合は処理しない
    if (this.classesArray) return this.classesArray
    // 「冒険者」の配列を作成
    const levelElm = document.querySelector('#level dd')
    const levelTxt = levelElm.textContent
    const levelNum = Number(levelTxt)
    const levelAry = [{ label: '冒険者', value: levelNum }]
    // 「職業」の配列を作成
    const classesAry = Array.from(document.querySelectorAll('#classes dt')).map(element => {
      const elm = element.cloneNode(true)
      // ルビを削除
      const rtElm = elm.querySelector('rt')
      if (rtElm) rtElm.innerHTML = ''
      const labelTxt = elm.textContent
      // 呪文使い系の補足を削除
      const label = labelTxt.replace(/(\([^\(\)]*\))/, '')
      const valueElm = element.nextElementSibling.cloneNode(true)
      const valueTxt = valueElm.textContent
      const value = Number(valueTxt)
      const obj = { label: label, value: value }
      return obj
    })
    const classesArray = [...levelAry, ...classesAry]
    // インスタンス変数に保存
    this.classesArray = classesArray
    return classesArray
  }

  /**
   * 指定された「職業」のうち、最大値の職業とレベルのオブジェクトを返す
   * @param {string[]} sendClassesArray 職業名の配列[]
   * @returns {{label: string, value: number}} {label: 職業, value: レベル} もしくは null
   */
  getClassesMaxValue(sendClassesArray) {
    if (sendClassesArray == null) return
    const classesArray = this.getClassesArray()
    const obj = { label: '', value: 0 }
    // 送信された職業の配列を1つずつ見る
    sendClassesArray.forEach(sendClasseLabel => {
      // 職業の配列でlabelの一致、かつvalueがobjよりも大きければobjに保存
      classesArray.forEach(classesObject => {
        const label = classesObject.label
        const value = classesObject.value
        if (sendClasseLabel === label && obj.value < value) {
          obj.label = label
          obj.value = value
        }
      })
    })
    if (!obj.label.length) return null
    return obj
  }

  /**
   * 「技能」の配列を返す
   * @returns {{label: string, value: number}[]} {label: 技能, value: バフ}[] もしくは null
   */
  getSkillsArray() {
    // インスタンス変数に存在する場合は処理しない
    if (this.skillsArray) return this.skillsArray
    // 冒険者技能・一般技能を1つずつ処理
    const skillsAry = Array.from(document.querySelectorAll('#area-skills .name')).map(elm => {
      // 技能名
      const labelTxt = elm.textContent
      const labelTrm = labelTxt.trim()
      const labelMth = labelTrm.match(/【(.*?)】/)
      if (labelMth == null) return null
      const label = labelMth[1]
      // 取得段階
      const gradeElm = elm.nextElementSibling
      const gradeTxt = gradeElm.textContent
      const gradeTrm = gradeTxt.trim()
      const gradeArray = ['初歩', '習熟', '熟練', '達人', '伝説']
      const gradeIndex = gradeArray.indexOf(gradeTrm)
      // バフ
      const valueRateAry = {
        // +(n+0)/+(n+1)/+(n+2)/+(n+3)/+(n+4)
        '受け流し': [0, 1, 2, 3, 4],
        // 0/+1/+2/+3/+4
        '挑発': [0, 1, 2, 3, 4],
        '戦術移動': [0, 1, 2, 3, 4],
        // +2/+3/+4/+5/+6
        '鉄壁': [2, 3, 4, 5, 6],
        'すり抜け': [2, 3, 4, 5, 6],
        // +2/+4/+6/+8/+10
        '怪物知識': [2, 4, 6, 8, 10],
        // 0/+2/+4
        '影渡り': [0, 2, 4],
        '霧化': [0, 2, 4],
        '吸血鬼感知': [0, 2, 4],
        '魔眼：〇〇': [0, 2, 4],
        // +1/+2/+4
        '冷静沈着': [1, 2, 4],
        '介護': [1, 2, 4],
        '博識': [1, 2, 4],
        '長距離移動': [1, 2, 4],
        '統率': [1, 2, 4],
        '祈祷': [1, 2, 4],
        '瞑想': [1, 2, 4],
        '鑑定': [1, 2, 4],
        '交渉：〇〇': [1, 2, 4],
        '神学': [1, 2, 4],
        '生存術': [1, 2, 4],
        '先入観なし': [1, 2, 4],
        '犯罪知識': [1, 2, 4],
        '文献調査': [1, 2, 4],
        '礼儀作法': [1, 2, 4],
        '労働': [1, 2, 4],
        '生産業：〇〇': [1, 2, 4],
        '職人：〇〇': [1, 2, 4],
        '芸能：〇〇': [1, 2, 4],
        '工作': [1, 2, 4],
        '乗馬': [1, 2, 4],
        '調理': [1, 2, 4],
        '拷問': [1, 2, 4],
        '地図製作': [1, 2, 4],
        '赦しの秘跡': [1, 2, 4],
        //+2/+4/+6
        '超怪力': [2, 4, 6],
        '超感覚': [2, 4, 6],
      }
      const valueAry = (valueRateAry[label]) ? valueRateAry[label] : [1, 2, 3, 4, 5]
      const value = valueAry[gradeIndex]
      const add = (/受け流し/.test(label)) ? '+n' : null
      const obj = { label: label, value: value, add: add }
      return obj
    })
    // nullを除外
    const skillsArray = skillsAry.filter(Boolean)
    // インスタンス変数に保存
    this.skillsArray = skillsArray
    return skillsArray
  }

  /**
   * 指定された「技能」のうち、最大値の技能とバフのオブジェクトを返す
   * @param {string[]} sendSkillsArray 技能の配列[]
   * @returns {{label: string, value: number}} {label: 技能, value: バフ} もしくは null
   */
  getSkillsMaxValue(sendSkillsArray) {
    if (sendSkillsArray == null) return
    const skillsArray = this.getSkillsArray()
    const obj = { label: '', value: 0, add: null }
    // 送信された技能の配列を1つずつ見る
    sendSkillsArray.forEach(sendSkillsLabel => {
      // 技能の配列でlabelの一致、かつvalueがobjよりも大きければobjに保存
      skillsArray.forEach(skillsObject => {
        const label = skillsObject.label
        const value = skillsObject.value
        const add = skillsObject.add
        // labelが同じか？
        if (sendSkillsLabel === label) {
          // value大きいか？
          if (obj.value < value) {
            obj.label = label
            obj.value = value
            obj.add = add
          }
          // もしvalue同じならaddが存在する方を優先する
          else if (obj.value == value && add != null) {
            obj.label = label
            obj.value = value
            obj.add = add
          }
        }
      })
    })
    if (!obj.label.length) return null
    return obj
  }

  /**
   * 「武器」の配列を返す
   * @returns {{name: name, type:type, hit:hit, power:power, jobs:jobs}[]} {name: 武器名, type:武器種, hit:命中, power:威力, jobs:職業}
   */
  getWeaponsArray() {
    const options = this.options
    const weponsAry = Array.from(document.querySelectorAll('#weapons tbody:has(.name)')).map(element => {
      const elm = element.cloneNode(true)
      // 武器名
      if (!options.ruby) Array.from(elm.querySelectorAll('.name rp, .name rt')).forEach(e => e.innerHTML = '')
      const name = elm.querySelector('.name').innerText.trim()
      // 武器種（【武器：〇〇】に使用）
      const type = (_ => {
        const typeElm = elm.querySelector('.type')
        const spanElm = typeElm.querySelector('span')
        if (spanElm) spanElm.innerHTML = ''
        const type = typeElm.innerText.trim()
        return type
      })()
      // 武器のみの命中
      let hit = 0
      // 威力（ダメージ）
      const power = elm.querySelector('.power').innerText.trim()
      // 職業
      const jobs = (_ => {
        // 合計値
        const sumElm = elm.querySelector('.hit b')
        const sumTxt = sumElm.innerText
        const sumNum = Number(sumTxt)
        sumElm.innerHTML = ''
        // バフ
        const hitElm = elm.querySelector('.hit')
        const hitTxt = hitElm.innerText.replace(/=/g, '')
        const hitNum = Number(hitTxt)
        hit = hitNum
        // 合計値からバフを引いて職業と照らし合わせ
        const num = (hitTxt.length) ? sumNum - hitNum : sumNum
        const jobs = Array.from(document.querySelectorAll('#attack-classes tbody tr:has(.name)')).map(e => {
          const nameElm = e.querySelector('.name')
          const name = nameElm.innerText.trim()
          const t = (/弩弓/.test(type)) ? 'projectile' : (/投擲武器/.test(type)) ? 'throwing' : 'melee'
          const nElm = e.querySelector(`[id*="attack-\${ename}-${t}"]`)
          const n = nElm.innerText.trim()
          if (n == num) return name
        }).filter(Boolean)[0]
        return jobs || ''
      })()
      const obj = { name: name, type: type, hit: hit, power: power, jobs: jobs }
      return obj
    })
    return weponsAry
  }

  /**
   * 「呪文」の配列を返す
   * @returns {{name: string, type:string, attr:string[], system:string, jobs:string}[], dfclt:stirng} {name: 武器名, type:種別, attr:属性, system:呪文系統, jobs:職業, dfclt:難易度}
   */
  getSpellsArray() {
    const options = this.options
    const spellsAry = Array.from(document.querySelectorAll('#spells tbody tr:has(.name)')).map(element => {
      const elm = element.cloneNode(true)
      // 呪文名
      if (!options.ruby) Array.from(elm.querySelectorAll('.name rp, .name rt')).forEach(e => e.innerHTML = '')
      const name = elm.querySelector('.name').innerText.trim()
      // 種別（【呪文熟達：〇〇】に使用）
      const typeElm = elm.querySelector('.type')
      const type = typeElm.innerText.replace(/\(.*\)/, '').trim()
      const attr = typeElm.innerText.replace(/.*\(|\).*/g, '').trim().split('、')
      // 呪文系統
      const system = elm.querySelector('.system').innerText.trim()
      // 職業
      const jobs = { '真言呪文': '魔術師', '奇跡': '神官', '祖竜術': '竜司祭', '精霊術': '精霊使い', '死霊術': '死人占い師' }[system]
      // 難易度
      const dfclt = elm.querySelector('.dfclt').innerText.trim()
      // 呪文行使基準値
      const spellCastTitleElm = document.querySelector('#spell-cast td[colspan="4"]')
      const spellCast = (spellCastTitleElm) ? spellCastTitleElm.nextElementSibling.innerText.trim() : '0'
      const obj = { name: name, type: type, attr: attr, system: system, jobs: jobs, dfclt: dfclt, spellCast: spellCast }
      return obj
    })
    return spellsAry
  }

  /**
   * 
   */
  getArmorsArray() {
    const options = this.options
    const armorsAry = Array.from(document.querySelectorAll('#armor tbody:has(.name)')).map(element => {
      const elm = element.cloneNode(true)
      // 防具名
      if (!options.ruby) Array.from(elm.querySelectorAll('.name rp, .name rt')).forEach(e => e.innerHTML = '')
      const name = elm.querySelector('.name').innerText.trim()
      // 回避基準値
      const sumElm = elm.querySelector('.dodge b')
      if (sumElm) sumElm.innerHTML = ''
      const dodgeElm = elm.querySelector('.dodge')
      const dodge = dodgeElm.innerText.trim().replace(/=/g, '')
      const value = Number(dodge)
      const obj = { name: name, value: value }
      return obj
    })
    return armorsAry
  }

  /**
   * 
   */
  getCommands() {
    const options = this.options
    /**
     * チャパレのタイトル
     * @param {*} object 
     * @returns 
     */
    const createTitle = (object) => {
      const { title, explanation, ability, classes, skills } = object
      const abilityText = (ability) ? ability.join('') : null
      const classesText = (classes) ? `職業[${classes.join(', ')}]` : null
      const skillsText = (skills) ? `技能[${skills.join(', ')}]` : null

      const textArray = [abilityText, classesText, skillsText].filter(Boolean)
      let text = textArray.join(' + ')
      text = (explanation) ? `${explanation} ${text}` : text
      text = `【${title}】${text}`

      return text
    }
    /**
     * ダイスコマンド
     * @param {*} object 
     */
    const createCommands = object => {
      const { title, ability, classes, skills, weapons } = object
      // チャパレ
      let commandsArray = []
      let averageNumber = 7
      let skillsAdd = ''
      // 第一能力・第二能力 {label: string, value: number}[] || null
      const abilityValues = this.getAbilityValues(ability)
      if (abilityValues) {
        abilityValues.forEach(abilityObject => {
          commandsArray.push(abilityObject.label)
          averageNumber = averageNumber + abilityObject.value
        })
      }
      // 職業 {label: string, value: number} || null
      const classesMax = this.getClassesMaxValue(classes)
      if (classesMax) {
        commandsArray.push(classesMax.label)
        averageNumber = averageNumber + classesMax.value
      }
      // 技能 {label: string, value: number, add: string} || null
      const skillsMax = this.getSkillsMaxValue(skills)
      if (skillsMax) {
        commandsArray.push(skillsMax.label)
        averageNumber = averageNumber + skillsMax.value
        if (skillsMax.add) {
          commandsArray.push(`${skillsMax.label}補正`)
          skillsAdd = skillsMax.add
        }
      }
      // 武器 {label: string, value: number} || null
      let weaponsVar = ''
      let weaponsTxt = ''
      let weaponsPower = ''
      if (weapons) {
        const weaponsLabel = weapons.label
        weaponsVar = `//${weaponsLabel}=${weapons.value}\n`
        weaponsTxt = `+{${weaponsLabel}}`
        averageNumber = averageNumber + weapons.value
        // ダメージ
        if (weapons.power) weaponsPower = `\n${weapons.power} 〈${weapons.label} ダメージ〉}`
      }
      let commandsText = commandsArray.map(v => `{${v}}`).join('+')
      let commands = ''
      // 呪文行使のコマンド
      if (/呪文行使判定/.test(title)) {
        const { attr, dfclt, jobs, name, system, spellCast, type } = object.spells
        averageNumber = averageNumber + Number(spellCast)
        commands = `GS+(${commandsText}+{呪文行使基準値})>=(${dfclt}) 〈${title}${name}〉 期待値(${averageNumber})`
      }
      // それ以外のコマンド
      else {
        commandsText = (commandsText.length) ? `+(${commandsText}${weaponsTxt})` : ''
        const achievement = (/先制判定|命中判定|挑発判定|移動妨害判定/.test(title)) ? '' : `>={${options.targetValue}}`
        commands = `${weaponsVar}GS${commandsText}${achievement} 〈${title}〉 期待値(${averageNumber}${skillsAdd})${weaponsPower}`
      }

      return commands
    }
    /**
     * コマンドのテキストを作成
     * @param {*} object 
     */
    const getCommandsText = object => {
      // オプションの設定で非表示にする
      const title = (options.title) ? createTitle(object) : null
      const commands = createCommands(object)
      const chat = [title, commands].filter(Boolean).join('\n')
      return chat
    }

    // 判定一覧を取ってくる
    const jl = new JL()
    const commandsArray = jl.getJudgmentList(options)

    // チャパレ
    const commandsTextArray = commandsArray.map(array => {
      // 特定の判定は配列を追加する必要がある
      const replaceArray = array.reduce((accumulator, object) => {
        if (object.title === '命中判定') {
          const weponsArray = this.getWeaponsArray()
          const replacements = weponsArray.map((obj, index) => {
            const newObject = {
              ...object,
              title: `${object.title} ${index + 1}.${obj.name}`,
              classes: [obj.jobs],
              skills: [`武器：${obj.type}`, '超命中'],
              weapons: {
                label: `${index + 1}.${obj.name}`,
                value: obj.hit,
                power: obj.power,
                parry: options[`parry${index}`]
              }
            }
            return newObject
          })
          replacements.forEach(replacement => accumulator.push(replacement))
        }
        else if (object.title === '盾受け判定') {
          const replacements = Array.from(document.querySelectorAll('#shield tbody:has(.name)')).map((element, index) => {
            const elm = element.cloneNode(true)
            // 武器名
            if (!options.ruby) Array.from(elm.querySelectorAll('.name rp, .name rt')).forEach(e => e.innerHTML = '')
            const weaponsName = elm.querySelector('.name').innerText.trim()
            // 武器のバフ
            const sumElm = elm.querySelector('.block b')
            if (sumElm) sumElm.innerHTML = ''
            const blockElm = elm.querySelector('.block')
            const block = blockElm.innerText.trim().replace(/=/g, '')
            const weaponsBuff = Number(block)
            // オブジェクト
            const newObject = {
              ...object,
              title: `${object.title} ${index + 1}.${weaponsName}`,
              weapons: {
                label: `${index + 1}.${weaponsName}`,
                value: weaponsBuff
              }
            }
            return newObject
          })
          replacements.forEach(replacement => accumulator.push(replacement))
        }
        else if (object.title === '回避判定') {
          const armorsArray = this.getArmorsArray()
          const replacements = armorsArray.map((obj, index) => {
            const newObject = {
              ...object,
              title: `${object.title} ${index + 1}.${obj.name}`,
              weapons: {
                label: `${index + 1}.${obj.name}`,
                value: obj.value
              }
            }
            return newObject
          })
          replacements.forEach(replacement => accumulator.push(replacement))
        }
        else if (/呪文行使判定/.test(object.title)) {
          const spellsArray = this.getSpellsArray()
          // 判定一覧の職業ごとに処理
          object.classes.forEach(classes => {
            const classesMax = this.getClassesMaxValue([classes])
            // 職業がない時は除外
            if (!classesMax) return
            // 呪文一覧ごとに処理
            spellsArray.forEach(spellsObject => {
              // 一致しない職業は除外
              if (classes != spellsObject.jobs) return
              // 呪文熟達を持っているか
              const skillsMax = this.getSkillsMaxValue([`呪文熟達：${spellsObject.type}`])
              const skills = (skillsMax) ? [`呪文熟達：${spellsObject.type}`] : object.skills
              // オブジェクトを作成
              const newObject = { ...object, classes: [classes], skills: skills, spells: spellsObject }
              accumulator.push(newObject)
            })
            // 配列ではなく単一のクラスとして設定
            //const newObject = { ...object, title: `${object.title}（${classes}）`, classes: [classes] }
            //if (classesMax) accumulator.push(newObject)
          })
        }
        else if (/呪文維持判定/.test(object.title)) {
          object.classes.forEach(classes => {
            const classesMax = this.getClassesMaxValue([classes])
            // 配列ではなく単一のクラスとして設定
            const newObject = { ...object, title: `${object.title}（${classes}）`, classes: [classes] }
            if (classesMax) accumulator.push(newObject)
          })
        }
        // 第二がGMの場合、3種追加
        else if (object.ability?.includes('GM')) {
          const replacements = ['集中', '持久', '反射']
          replacements.forEach(replacement => {
            const newObject = { ...object, ability: object.ability.map(ability => ability === 'GM' ? replacement : ability) }
            newObject.title = `${newObject.title}（${newObject.ability.join('')}）`.replace(/）（/, ' ')
            accumulator.push(newObject)
          })
        }
        // その他はそのまま追加
        else {
          accumulator.push(object)
        }
        return accumulator
      }, [])
      // タイトルのみか否かで処理を変える
      const newArray = replaceArray.map(object => {
        if ('ability' in object || 'classes' in object || 'skills' in object) {
          return getCommandsText(object)
        } else {
          return `■${object.title}`
        }
      }).filter(Boolean)
      const commandsText = newArray.join('\n')
      return commandsText
    })
    // 配列からテキストにして返す
    const commandsText = commandsTextArray.join('\n　\n')
    return commandsText
  }

  /**
   * ココフォリアで駒生成ができるJSONを返す
   * @param {{title: Boolean, add: Boolean, sup: Boolean}} options 説明用テキスト、一覧以外の判定、サプリの判定
   * @returns {String} ココフォリアで駒生成ができるJSON
   */
  getJson(options) {
    // インスタンス変数に存在しない場合は保存
    if (this.options == null) this.options = options
    // 名前
    const name = document.getElementById('character-name').innerText
    // メモ
    const memo = ''
    // イニシアチブ
    const initiative = null
    // URL
    const externalUrl = location.href

    // 生命力
    const lifeTxt = document.querySelector('#lifeforce .total:nth-of-type(2) b').innerText
    const lifeNum = Number(lifeTxt)
    // 呪文
    const spellsTxt = document.querySelector('#movement + dl .total b').innerText
    const spellsNum = Number(spellsTxt)

    // パラメータの配列を作成
    const abilityArray = this.getAbilityArray()
    const classesArray = this.getClassesArray()
    const skillsArray = this.getSkillsArray()
    // 存在しない技能
    const notSkillsArray = (_ => {
      // 判定一覧を全部取ってくる
      const jl = new JL()
      const allClassesArray = jl.getAllClassesArray()
      const allSkillsArray = jl.getAllSkillsArray()
      const allArray = [...allClassesArray, ...allSkillsArray]
      const hasArray = [...abilityArray, ...classesArray, ...skillsArray].map(obj => obj.label)
      const diffArray = allArray.filter(item => !hasArray.includes(item))
      const resArray = diffArray.map(label => ({ label: label, value: '0' }))
      return resArray
    })()
    const paramsArray = [...abilityArray, ...classesArray, ...skillsArray, ...notSkillsArray]
    const params = paramsArray.reduce((accumulator, object) => {
      // 元のアイテムを追加
      const pushObject = { label: object.label, value: object.value.toString() }
      accumulator.push(pushObject)
      // addがある場合は補正パラメータを追加
      if (object.add != null) {
        const addValue = (object.label == '受け流し') ? options.parry : `${object.label}補正`
        const addObject = { label: `${object.label}補正`, value: addValue }
        accumulator.push(addObject)
      }
      return accumulator
    }, [])
    // 呪文行使基準値
    const spellsArray = this.getSpellsArray()
    const spellCast = (spellsArray.length) ? spellsArray[0].spellCast : '0'
    params.push({ label: '呪文行使基準値', value: spellCast })

    // 武器の命中基準値
    const weaponsArray = this.getWeaponsArray()
    weaponsArray.forEach((object, index) => {
      const weaponsName = object.name
      const label = `${index + 1}.${weaponsName}`
      const value = String(object.hit)
      params.push({ label: label, value: value })
    })
    // 防具の回避基準値

    // テキストカラー
    // https://qiita.com/Ynolen/items/05ed15ba6a33e9986c53
    const color = (_ => {
      const toHex = rgb => {
        const num = Number(rgb)
        const str = num.toString(16)
        const hex = (rgb.length == 1) ? `0${str}` : str
        return hex
      }
      const boxElm = document.querySelector('#gycc .box')
      const boxBackgroundImage = window.getComputedStyle(boxElm).backgroundImage
      const boxRGB = boxBackgroundImage.match(/rgba\((.*?)\)/)[1]
      const boxRGBAry = boxRGB.split(', ')
      boxRGBAry.pop() // アルファ値を削除
      const boxHexAry = boxRGBAry.map(rgb => toHex(rgb))
      const boxHexTxt = boxHexAry.join('')
      const boxHex = `#${boxHexTxt}`
      return boxHex
    })()

    // コマンドを作成
    const commands = this.getCommands()
    // クリックアクション用のパラメータを追加
    if (options.clickAction) {
      commands.split('\n').forEach(val => {
        const label = val.match(/〈(.*判定.*)〉/)
        const value = val.replace(/(>={| ).*/, '')
        if (label) params.push({ label: label[1], value: value })
      })
    }


    // JSONを作成
    const object = {
      kind: 'character',
      data: {
        name: name,
        memo: memo,
        initiative: initiative,
        externalUrl: externalUrl,
        status: [
          {
            label: '生命力',
            value: lifeNum,
            max: lifeNum
          },
          {
            label: '呪文回数',
            value: spellsNum,
            max: spellsNum,
          },
          {
            label: '継戦',
            value: 0,
            max: 0
          },
          {
            label: '消耗',
            value: 0,
            max: 0
          },
        ],
        params: params,
        color: color,
        commands: commands
      }
    }
    const json = JSON.stringify(object)
    return json
  }
}