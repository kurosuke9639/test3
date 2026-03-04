// === 診断ロジック一式 ===

const typeDefinitions = {
  A: {
    name: "対面ドリブン・オフィス型",
    subtitle: "対話と連携で加速する、オフィス主戦場タイプ",
    description:
      "集中しやすい場所はオフィス寄り、出社の目的は業務上の対面コミュニケーションやフィードバックに近いタイプです。対面での打ち合わせや、その場での認識合わせがあると仕事が前に進みやすく、上司やメンバーと直接話しながら評価・フィードバックや方向性のすり合わせをしていくことで力を発揮しやすいスタイルです。",
    hints:
      "重要な案件や調整が多い日は、あえて出社日の候補にするなど、「対話が価値になる時間」をオフィスに集める工夫がおすすめです。",
  },
  B: {
    name: "コミュニティ志向・オフィス型",
    subtitle: "人とのつながりでモチベーションが上がるタイプ",
    description:
      "集中しやすい場所はオフィス寄り、出社の目的は雑談や気軽なコミュニケーションに近いタイプです。同僚の顔が見える環境や、ちょっとした会話からヒントを得たり気分転換ができることで、仕事のペースが作りやすくなります。",
    hints:
      "雑談しやすいスペースや、同僚と隣り合える席を選んだり、出社日をチームメンバーと合わせておくことで、オフィスのメリットを活かしやすくなります。",
  },
  C: {
    name: "リモート主軸・要所対面型",
    subtitle: "ふだんはオンライン、要所は対面で押さえるタイプ",
    description:
      "集中しやすい場所は自宅寄り、出社の目的は業務上の対面コミュニケーションやフィードバックに近いタイプです。日常的な作業や思考時間は自宅などの落ち着いた環境でパフォーマンスを発揮しやすく、一方で重要な意思決定や難しい調整などは対面で行う価値を感じるスタイルです。",
    hints:
      "集中が必要なタスクは在宅日にまとめ、四半期レビューやプロジェクトキックオフなど「ここは対面にしたい」という場面だけ計画的に出社する、といったメリハリが合いやすいでしょう。",
  },
  D: {
    name: "ソロ集中・ゆるつながり型",
    subtitle: "普段は一人で、たまにゆるくつながりたいタイプ",
    description:
      "集中しやすい場所は自宅寄り、出社の目的は雑談や気軽なコミュニケーションに近いタイプです。一人で作業できる静かな環境の方が仕事を進めやすく感じやすい一方で、人とのつながりや雑談そのものも嫌いではなく、たまに会って近況を話したい気持ちもあるスタイルです。",
    hints:
      "在宅での集中環境を自分なりに整えつつ、出社日やオフラインイベントは「顔合わせの日」と割り切って、関係づくりや気分転換に使うとバランスが取りやすくなります。",
  },
  boundary: {
    name: "ハイブリッド・バランス型",
    subtitle: "どちらにも適応しやすい、しなやかスタイル",
    description:
      "自宅とオフィス、雑談と業務対面のどちらか一方に強く偏らず、状況に合わせて働き方を切り替えやすいタイプです。その日の仕事内容やメンバー構成、プライベートの予定などに応じて、「今日はオフィス」「今日は自宅」と柔軟に選びやすいスタイルです。",
    hints:
      "「このパターンの仕事は在宅」「このパターンは出社」といった自分なりの基準を少しずつ決めておくことで、よりストレスの少ない働き方を設計しやすくなります。",
  },
};

// DOM 読み込み後にセットアップ
document.addEventListener("DOMContentLoaded", () => {
  console.log("=== app.js loaded ===");

  const diagnosisForm = document.getElementById("diagnosis-form");
  const diagnosisButton = document.getElementById("diagnosis-button");
  const surveyForm = document.getElementById("survey-form");

  const resultSection = document.getElementById("result-section");
  const summarySection = document.getElementById("summary-section");

  const coordDisplay = document.getElementById("coord-display");
  const typeName = document.getElementById("type-name");
  const typeSubtitle = document.getElementById("type-subtitle");
  const typeDescription = document.getElementById("type-description");
  const typeHints = document.getElementById("type-hints");
  const userPoint = document.getElementById("user-point");

  if (!diagnosisForm || !diagnosisButton) {
    console.error("診断フォームまたはボタンが見つかりません");
    return;
  }

  // 診断ボタン押下
  diagnosisButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("diagnosis button clicked");

    const q1Value = getRadioValue("q1");
    const q2Value = getRadioValue("q2");

    if (q1Value === null || q2Value === null) {
      alert("Q1とQ2の両方に回答してください。");
      return;
    }

    const x = Number(q1Value);
    const y = Number(q2Value);

    if (coordDisplay) coordDisplay.textContent = `(${x}, ${y})`;

    const typeKey = judgeType(x, y);
    const typeInfo = typeDefinitions[typeKey];

    if (typeName) typeName.textContent = typeInfo.name;
    if (typeSubtitle) typeSubtitle.textContent = typeInfo.subtitle;
    if (typeDescription) typeDescription.textContent = typeInfo.description;
    if (typeHints) typeHints.textContent = typeInfo.hints;

    if (userPoint) plotPoint(userPoint, x, y);
    if (resultSection) resultSection.classList.remove("hidden");
  });

  // summarizeResult をグローバルに公開（HTML の onclick から呼ぶ）
  window.summarizeResult = function summarizeResult() {
    if (!surveyForm) {
      alert("アンケートフォームが見つかりません。");
      return;
    }

    const q1Value = getRadioValue("q1");
    const q2Value = getRadioValue("q2");

    if (q1Value === null || q2Value === null) {
      alert("まず Q1 と Q2 に回答し、マップにプロットしてください。");
      return;
    }

    const x = Number(q1Value);
    const y = Number(q2Value);

    const formData = new FormData(surveyForm);
    const answers = {};

    answers.q1 = mapQ1Label(x);
    answers.q2 = mapQ2Label(y);

    ["q3", "q4", "q6", "q7"].forEach((name) => {
      const v = formData.get(name);
      if (v) answers[name] = v;
    });

    const q5Values = formData.getAll("q5");
    if (q5Values.length > 0) answers.q5 = q5Values;

    ["q8", "q9"].forEach((name) => {
      const v = formData.get(name);
      if (v && v.trim() !== "") answers[name] = v.trim();
    });

    // まとめ用の4象限も「上と同じロジック」で点を打つ
    renderSummaryQuadrant(x, y);

    // QAリスト表示
    renderAnswerList(answers);

    // コピー用テキスト
    const copyText = buildCopyText(answers);
    const copyBuffer = document.getElementById("copy-buffer");
    if (copyBuffer) copyBuffer.value = copyText;

    // クリップボードコピー
    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        const msg = document.getElementById("copy-message");
        if (msg) msg.classList.remove("hidden");
      })
      .catch(() => {
        const msg = document.getElementById("copy-message");
        if (msg) msg.classList.remove("hidden");
      });

    if (summarySection) summarySection.classList.remove("hidden");
  };
});

// ===== 共通関数 =====

function getRadioValue(name) {
  const nodes = document.querySelectorAll(`input[name="${name}"]`);
  for (const node of nodes) {
    if (node.checked) return node.value;
  }
  return null;
}

// タイプ判定
function judgeType(x, y) {
  if (x === 0 || y === 0) return "boundary";
  if (x > 0 && y > 0) return "A";
  if (x > 0 && y < 0) return "B";
  if (x < 0 && y > 0) return "C";
  if (x < 0 && y < 0) return "D";
  return "boundary";
}

// SVG 上の座標変換（共通）
function plotPoint(pointElement, x, y) {
  const minVal = -2;
  const maxVal = 2;
  const svgMin = 0;
  const svgMax = 200;

  const cx = mapRange(x, minVal, maxVal, svgMin, svgMax);
  const cy = mapRange(-y, minVal, maxVal, svgMin, svgMax);

  pointElement.setAttribute("cx", cx);
  pointElement.setAttribute("cy", cy);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Q1, Q2 ラベル化
function mapQ1Label(x) {
  switch (x) {
    case -2:
      return "圧倒的に自宅で集中しやすい";
    case -1:
      return "やや自宅で集中しやすい";
    case 0:
      return "自宅・オフィスどちらとも言えない";
    case 1:
      return "ややオフィスで集中しやすい";
    case 2:
      return "圧倒的にオフィスで集中しやすい";
    default:
      return "";
  }
}

function mapQ2Label(y) {
  switch (y) {
    case -2:
      return "雑談・気軽なコミュニケーション目的の出社が近い";
    case -1:
      return "どちらかといえば雑談寄りの目的";
    case 0:
      return "雑談と業務対面のどちらとも言えない";
    case 1:
      return "どちらかといえば業務上の対面コミュニケーション目的";
    case 2:
      return "対面での評価・フィードバック目的の出社が近い";
    default:
      return "";
  }
}

// まとめ用4象限：上と同じロジックで描画
function renderSummaryQuadrant(x, y) {
  const point = document.getElementById("summary-user-point");
  if (!point) return;
  plotPoint(point, x, y);
}

// Q&A一覧表示
function renderAnswerList(answers) {
  const answerList = document.getElementById("answer-list");
  if (!answerList) return;

  answerList.innerHTML = "";

  const questionText = {
    q1: "Q1. 仕事に最も集中しやすい場所はどちらですか？",
    q2: "Q2. 出社する主な目的として、どちらが近いですか？",
    q3: "Q3. 自宅またはオフィスでの集中を妨げる要因について教えてください。",
    q4: "Q4. 「集中が必要な業務」を行う際、最適だと思う場所を教えてください。",
    q5: "Q5. 出社することで得たいものを教えてください。",
    q6: "Q6. 雑談や偶発的なコミュニケーションをどの程度重視しますか？",
    q7: "Q7. 対面での評価やフィードバックをどの程度重要だと感じますか？",
    q8: "Q8. 理想的な勤務スタイル（出社と在宅の割合）についてご意見があれば教えてください。",
    q9: "Q9. 出社やリモートワークの運用に関して、ご希望や改善点があれば自由にお書きください。",
  };

  Object.keys(questionText).forEach((key) => {
    if (answers[key] === undefined) return;
    const p = document.createElement("p");
    const label = questionText[key];

    if (Array.isArray(answers[key])) {
      p.textContent = `${label} ${answers[key].join(" / ")}`;
    } else {
      p.textContent = `${label} ${answers[key]}`;
    }
    answerList.appendChild(p);
  });
}

// コピー用テキスト
function buildCopyText(answers) {
  const questionText = {
    q1: "Q1. 仕事に最も集中しやすい場所はどちらですか？",
    q2: "Q2. 出社する主な目的として、どちらが近いですか？",
    q3: "Q3. 自宅またはオフィスでの集中を妨げる要因について教えてください。",
    q4: "Q4. 「集中が必要な業務」を行う際、最適だと思う場所を教えてください。",
    q5: "Q5. 出社することで得たいものを教えてください。",
    q6: "Q6. 雑談や偶発的なコミュニケーションをどの程度重視しますか？",
    q7: "Q7. 対面での評価やフィードバックをどの程度重要だと感じますか？",
    q8: "Q8. 理想的な勤務スタイル（出社と在宅の割合）についてご意見があれば教えてください。",
    q9: "Q9. 出社やリモートワークの運用に関して、ご希望や改善点があれば自由にお書きください。",
  };

  const lines = [];
  lines.push("▼働き方のスタイルに関する質問と回答");

  Object.keys(questionText).forEach((key) => {
    if (answers[key] === undefined) return;
    const label = questionText[key];
    if (Array.isArray(answers[key])) {
      lines.push(`${label} ${answers[key].join(" / ")}`);
    } else {
      lines.push(`${label} ${answers[key]}`);
    }
  });
  lines.push("");

  lines.push(
    "これらは回答者の働き方のスタイルに関する回答結果である。これらの質問・回答を踏まえて、回答者はどんな働き方をしていったらよいかアドバイスがほしい。"
  );
  lines.push("");
  lines.push(
    "生成AIで回答を分析するためのプロンプトと一緒にコピーしました。ご自身の生成AIで分析してみてくださいね！"
  );

  return lines.join("\n");
}
