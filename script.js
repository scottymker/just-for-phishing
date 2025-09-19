// Minimal working quiz bootstrap + button fix
const quizArea = document.getElementById('quiz-area');
const btn = document.getElementById('start-level-1');

const QUESTIONS = [
  { type:'mc', q:'Spot the phish: Which email is safest to click?', choices:[
    'From “IT Support” asking for your password via link',
    'From your bank with a mismatched domain (usbank-alerts-secure.com)',
    'From a colleague via your real company domain you were expecting',
    'A shipping notice with a shortened URL'],
    answer:2
  },
  { type:'tf', q:'Hovering links shows the real destination.', answer:true },
  { type:'multi', q:'Select all strong MFA factors:', choices:[
    'TOTP app code','Email code','SMS code on same phone','Hardware security key'], answers:[0,3] },
  { type:'tf', q:'Attachment “invoice.zip.exe” is safe to open.', answer:false },
  { type:'mc', q:'Best action on suspicious email:', choices:[
    'Reply asking if it’s legit','Forward to personal email',
    'Report via the phishing button','Click but in incognito'], answer:2 }
];

function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]} return a; }

function startLevel(){
  quizArea.classList.remove('hidden');
  quizArea.innerHTML = renderQuiz(shuffle([...QUESTIONS]).slice(0,5));
}

function renderQuiz(qs){
  return `
    <h2>Level 1 — Quick Check</h2>
    <form id="quiz-form">
      ${qs.map((q,i)=>renderQ(q,i)).join('')}
      <button class="btn" type="submit">Submit</button>
    </form>
    <div id="quiz-result" class="card hidden"></div>
  `;
}

function renderQ(q,i){
  if(q.type==='tf'){
    return `
    <div class="card">
      <div><strong>Q${i+1}.</strong> ${q.q}</div>
      <label><input type="radio" name="q${i}" value="true"> True</label>
      <label style="margin-left:16px"><input type="radio" name="q${i}" value="false"> False</label>
    </div>`;
  }
  if(q.type==='multi'){
    return `
    <div class="card">
      <div><strong>Q${i+1}.</strong> ${q.q}</div>
      ${q.choices.map((c,ci)=>`<label style="display:block;margin:6px 0">
        <input type="checkbox" name="q${i}" value="${ci}"> ${c}
      </label>`).join('')}
    </div>`;
  }
  return `
  <div class="card">
    <div><strong>Q${i+1}.</strong> ${q.q}</div>
    ${q.choices.map((c,ci)=>`<label style="display:block;margin:6px 0">
      <input type="radio" name="q${i}" value="${ci}"> ${c}
    </label>`).join('')}
  </div>`;
}

function grade(e){
  e.preventDefault();
  const form = new FormData(e.target);
  let score = 0, total = 5;
  for(let i=0;i<total;i++){
    const q = QUESTIONS[i];
    if(q.type==='tf'){
      const v = form.get(`q${i}`);
      if(v === String(q.answer)) score++;
    } else if(q.type==='multi'){
      const vals = form.getAll(`q${i}`).map(Number).sort();
      const ans = (q.answers||[]).slice().sort();
      if(JSON.stringify(vals)===JSON.stringify(ans)) score++;
    } else {
      const v = Number(form.get(`q${i}`));
      if(v===q.answer) score++;
    }
  }
  const res = document.getElementById('quiz-result');
  res.classList.remove('hidden');
  res.textContent = `Score: ${score}/${total}`;
}

btn?.addEventListener('click', startLevel);
document.addEventListener('submit', grade);
