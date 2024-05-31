export class HTML {

  getButtonHtml() {
    const html = `
<article id="gycc">
  <section class="box">
    <h2>「GYCC拡張機能」設定</h2>
    <div class="box-container">
      <div class="check">
        <!--
        <div>
          <input type="checkbox" id="gycc_title" name="gycc_title"/>
          <label for="gycc_title">技能判定の説明を出力</label>
        </div>
        -->
        <div>
          <input type="checkbox" id="gycc_add" name="gycc_add" checked/>
          <label for="gycc_add">判定一覧に無い技能も出力</label>
        </div>
        <div>
          <input type="checkbox" id="gycc_sup" name="gycc_sup" checked/>
          <label for="gycc_sup">サプリで追加された技能も出力</label>
        </div>
      </div>
      <div class="btn">
        <svg><rect x="2" y="2" rx="0" fill="none" width=200 height="50"></rect></svg>
        <span>コピーする</span>
      </div>
    </div>
    <style>
    #gycc {
      @media screen and (min-width: 1400px){
        grid-template-columns: 1fr;
        justify-items: center;
        align-items: center;
        section {
          width: 50%;
        }
      }
      .box-container {
        margin: .3rem .5em;
        line-height: 1.8;
        text-align: center;
      }
      .btn {
        margin: 1.5rem 0;
        font-size: 1.6rem;
        font-weight: 700;
        line-height: 1.5;
        position: relative;
        display: inline-block;
        padding: 1rem 4rem;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        text-align: center;
        vertical-align: middle;
        text-decoration: none;
        letter-spacing: 0.1em;
        color: #fff;
        border-radius: 0.5rem;
        
        font-weight: 700;
        line-height: 54px;
        width: 204px;
        height: 54px;
        padding: 0;
        cursor: pointer;
        text-decoration: none;
        background-color: transparent;
        svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          rect {
            -webkit-transition: all 400ms ease;
            transition: all 400ms ease;
            stroke: #fff;
            stroke-width: 2;
            stroke-dasharray: 200px, 16px;
            stroke-dashoffset: 70px;
          }
        }
        &:hover svg rect {
          stroke-dashoffset: 284px;
        }
        span {
          color: #fff;
        }
      }
    }
    </style>
  </section>
</article>
`
    return html
  }
}