//@ts-check

/** 盤面を表すHTML要素 */
const table = document.getElementById("field") ?? (()=>{throw new Error("HTMLElement '#field' is not found.")})();
//console.log(table);

/** ターン表示HTML要素 */
const turnBox = document.getElementById("turn") ?? (()=>{throw new Error("HTMLElement '#turn' is not found.")})();
//console.log(turnBox);

/** ターンを表す記号表示HTML要素 */
const turnMarkEle = turnBox.querySelector("div.mark") ?? (()=>{throw new Error("HTMLElement '#turn div.mark' is not found.")})();
//console.log(turnMarkEle);

/** 勝者表示HTML要素 */
const winningBox = document.getElementById("winning") ?? (()=>{throw new Error("HTMLElement '#winning' is not found.")})();
//console.log(wonBox);

/** 勝者を表す記号表示HTML要素 */
const winningMarkEle = winningBox.querySelector("div.mark") ?? (()=>{throw new Error("HTMLElement '#winning div.mark' is not found.")})();
//console.log(wonMarkEle);

/** 引き分け表示HTML要素 */
const drawBox = document.getElementById("draw") ?? (()=>{throw new Error("HTMLElement '#draw' is not found.")})();
//console.log(drawBox);


/**
 * @typedef {1|-1} markNumType 記号を表す数値型
 * @typedef {markNumType|0} cellType 盤面の1マスの状態を表す数値型
 * @typedef {[cellType,cellType,cellType]} rowType 盤面の行を表す配列型
 * @typedef {[rowType,rowType,rowType]} tableType 盤面全体を表す2次元配列型
 */

/** @type {{"1": "circle","-1": "cross"}} 記号を表す数値とその記号名を紐づけるオブジェクト*/
const markNumToName = {
    "1": "circle",
    "-1": "cross"
}

/** @type {markNumType} 現在のターンを表す変数*/
let turnNum = -1;
/** @type {number} 現在の経過ターン数を表す数値型変数*/
let cnt = 0;
/** @type {tableType} 盤面の状態を管理する2次元配列*/
const tableArrs = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

viewMark(turnMarkEle,turnNum);/* 最初のターンの記号を表示 */

table.addEventListener("click",clickEvent);/* クリック時の実行関数を設定 */

/**
 * 行と列のインデックスから、その場所に記号をマークすることができるかを返す関数
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns {boolean}
 */
function isAbleToMark(rowIndex,columnIndex){
    let a;
    if(tableArrs[rowIndex][columnIndex]==0){
       a=true; 
    }else{
           a=false;
    }
    return a;
}

/**
 * 各グローバル変数の値を更新する関数
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns {void}
 */
function updateStates(rowIndex,columnIndex){
    tableArrs[rowIndex][columnIndex]=turnNum;
     turnNum=turnNum*-1;
     cnt+=1;
}

/**
 * 盤面の状態から、ゲーム終了であるか、勝敗が決まったか、勝者はいずれか、を過不足なく返す関数。
 * 戻り値はその3つの値を順に格納する配列。
 * ゲーム終了でなければ、以降2つの配列の要素は「undefined」とする。
 * ゲーム終了であるが、勝敗が決まらなかった場合は、3つ目の要素は「undefined」とする。
 * @returns {[false,undefined,undefined]|[true,false,undefined]|[true,true,markNumType]}
 */
function getStates(){
    let got_match =false
      let h = undefined
      let winner =　undefined
    if (check_complete()) {
        got_match = true
        h=true
        winner=markNumType
    }
  function check_complete() {
    let results = $("td").get()
    let completed = false
    
      
      
 
    // そろう8パターンがあるかチェック
    for (let ct= 0; ct< complete_patterns.length; ct++) {
      // 1つのパターンを抽出し、そのパターンのセル番号をさらに抽出
      let pattern = complete_patterns[ct]
      // チェック対象の3つのセルを抽出
      let cell1 = $(results[pattern[0]]).html()
      let cell2 = $(results[pattern[1]]).html()
      let cell3 = $(results[pattern[2]]).html()
      // 3つのセルの内容が等しいか確認（undefined や "" で全て一致することを避けるため、cell1 だけ中身をチェック）
      completed = cell1 && cell1 == cell2 && cell2 == cell3 && cell3 == cell1
      // 1つでもそろった行・列がある場合はチェックを終了
      if (completed) break
    }
    return completed
  }
}
    return [got_match,h,winner];
}
g
/**
 * 盤（盤のセル）をクリックした際に呼び出される関数
 * @param {MouseEvent} e
 * @returns {void}
 */
function clickEvent(e){
    //console.log(e);
    const cell = e.target;/* クリックされたセルHTML要素を取得 */
    if(!(cell instanceof HTMLTableCellElement))return;/* 要素チェック */
    const columnIndex = cell.cellIndex;/* 列インデックスを取得 */

    const row = cell.parentElement;/* セルHTML要素を持つ行HTML要素を取得 */
    if(!(row instanceof HTMLTableRowElement))return;/* 要素チェック */
    const rowIndex = row.rowIndex;/* 行インデックスを取得 */

    if(!isAbleToMark(rowIndex,columnIndex)){/* マークできない場所であれば関数を終了 */
        return;
    }
    const markEle = cell.querySelector("div.mark");/* セルの記号表示HTML要素を取得 */
    /* 記号表示HTML要素がなければエラー */
    if(markEle == null)throw new Error("Error: HTMLElement 'div.mark' is not found in the clicked target");

    viewMark(markEle,turnNum);/* セルに記号を表示 */

    updateStates(rowIndex,columnIndex);/* 変数の値を更新 */

    viewMark(turnMarkEle,turnNum);/* 次のターンの記号を案内表示 */
    const states = getStates();/* ゲーム状況を取得 */
    if(states[0]){/* ゲームが終了していれば... */
        const [,...finishArgs] = states;/* 対戦結果を取得 */
        doFinish(finishArgs);/* 対戦結果からリザルト表示と、ゲーム終了処理 */
    }
    return;
}

/**
 * 記号表示HTML要素に指定した記号を表示させる関数
 * @param {Element} markEle 記号表示HTML要素
 * @param {markNumType} markNum 指定する記号の数値
 * @returns {void}
 */
function viewMark(markEle,markNum){
    //console.log(markEle);
    //console.log(markNum);
    /* 不正な値を指定した場合はエラー */
    if(!markNumToName.hasOwnProperty(markNum))throw new Error(`Error: Illegal markNum ${markNum}`);
    markEle.classList.remove("circle");
    markEle.classList.remove("cross");
    markEle.classList.add(markNumToName[markNum]);/* 指定した記号に上書き */
    return;
}

/**
 * ゲーム終了処理およびリザルト表示を行う関数
 * @param {[false,undefined]|[true,markNumType]} args winningMarkNumは、isWinningが、falseならばundefined、trueならば1または-1
 * @return {void}
 */
function doFinish([isWinning,winningMarkNum]){
    if(isWinning){/* 勝敗が決まったら... */
        winningBox.classList.add("open");/* 勝者表示HTML要素を表示 */
        viewMark(winningMarkEle,winningMarkNum);/* 勝者の記号を表示 */
    }else{/* 引き分けならば... */
        drawBox.classList.add("open");/* 引き分け表示HTML要素を表示 */
    }
    turnBox.classList.remove("open");/* ターン表示HTML要素を非表示にする */
    table.removeEventListener("click",clickEvent);
}
