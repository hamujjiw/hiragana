import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthProvider, useAuth } from "../lib/auth";
import { getProgress, upsertProgress, updateLevel, saveLevelTest, masteryColor } from "../lib/progress";
import { addXP, checkAndUpdateStreak, getXPProgress, XP_REWARDS } from "../lib/xp";
import { hiraganaGroups, allHiragana, mnemonics } from "../data/hiragana";
import { vocabulary, phrases, sentences, levelTests } from "../data/content";
import CatAvatar from "../components/CatAvatar";
import XPToast from "../components/XPToast";
import LevelUpModal from "../components/LevelUpModal";

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

const T={
  navy:"#0D2B5E",blue:"#1E88E5",bluePale:"#E3EDF8",blueFaint:"#F0F4FB",
  text:"#0D2B5E",textMid:"#5A7BA8",textLight:"#8BADD4",border:"#D0DFF0",white:"#FFFFFF",
  green:"#1D9E75",greenPale:"#E1F5EE",yellow:"#E8960C",yellowPale:"#FEF3DC",
  red:"#E53935",redPale:"#FEF0F0",
};

function ProgressBar({value,max,color=T.blue}){
  const pct=max>0?Math.min(100,Math.round((value/max)*100)):0;
  return(
    <div style={{background:T.bluePale,borderRadius:999,height:5,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:999,transition:"width 0.5s ease"}}/>
    </div>
  );
}

function Card({children,style={}}){
  return <div style={{background:T.white,borderRadius:16,border:`1px solid ${T.border}`,padding:"16px",...style}}>{children}</div>;
}

function PillBtn({children,active,onClick,style={}}){
  return(
    <button onClick={onClick} style={{
      padding:"7px 16px",borderRadius:999,border:`1.5px solid ${active?T.blue:T.border}`,
      background:active?T.blue:T.white,color:active?T.white:T.textMid,
      fontSize:13,fontWeight:active?600:400,cursor:"pointer",transition:"all 0.18s",
      fontFamily:"'DM Sans',sans-serif",...style
    }}>{children}</button>
  );
}

function QuizPanel({items,onAnswer}){
  const [q,setQ]=useState(null);
  const [selected,setSelected]=useState(null);
  const makeQ=useCallback(()=>{
    if(!items||items.length<4)return;
    const correct=items[Math.floor(Math.random()*items.length)];
    const wrong=shuffle(items.filter(i=>i.id!==correct.id)).slice(0,3);
    setQ({correct,options:shuffle([correct,...wrong])});
    setSelected(null);
  },[items]);
  useEffect(()=>{makeQ();},[makeQ]);
  if(!q)return<div style={{color:T.textLight,fontSize:13,textAlign:"center",padding:32}}>Minimal 4 item untuk kuis.</div>;
  const handlePick=(opt)=>{
    if(selected)return;
    setSelected(opt);
    onAnswer&&onAnswer(q.correct,opt.id===q.correct.id);
    setTimeout(()=>makeQ(),1000);
  };
  return(
    <div>
      <Card style={{textAlign:"center",marginBottom:14,padding:"32px 20px"}}>
        <div style={{fontSize:q.correct.kana?52:20,fontFamily:q.correct.kana||q.correct.japanese?"'Noto Sans JP',sans-serif":"inherit",color:T.navy,lineHeight:1.4}}>
          {q.correct.kana||q.correct.japanese}
        </div>
        {q.correct.romaji&&<div style={{fontSize:12,color:T.textLight,marginTop:6}}>{q.correct.romaji}</div>}
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        {q.options.map(opt=>{
          let bg=T.white,border=T.border,color=T.text;
          if(selected){
            if(opt.id===q.correct.id){bg=T.greenPale;border=T.green;color=T.green;}
            else if(selected.id===opt.id){bg=T.redPale;border=T.red;color=T.red;}
          }
          return(
            <button key={opt.id} onClick={()=>handlePick(opt)}
              style={{padding:"14px 10px",borderRadius:12,border:`1.5px solid ${border}`,background:bg,color,fontSize:13,cursor:selected?"default":"pointer",transition:"all 0.18s",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>
              {opt.meaning}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Flashcard({item,idx,total,progress,onNext,onPrev}){
  const [flipped,setFlipped]=useState(false);
  useEffect(()=>setFlipped(false),[item]);
  if(!item)return null;
  const p=progress[item.id];
  const mc=masteryColor(p);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:12,color:T.textLight}}>{idx+1} / {total}</span>
        <div style={{width:7,height:7,borderRadius:"50%",background:mc}}/>
      </div>
      <div onClick={()=>setFlipped(f=>!f)} style={{perspective:1000,cursor:"pointer",height:200,marginBottom:18}}>
        <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:T.navy,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{fontSize:item.kana?52:18,fontFamily:"'Noto Sans JP',sans-serif",color:T.white,lineHeight:1.4,textAlign:"center",padding:"0 20px"}}>
              {item.kana||item.japanese}
            </div>
            {item.romaji&&item.kana&&<div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>{item.romaji}</div>}
            <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:4}}>tap untuk lihat arti</div>
          </div>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:T.bluePale,border:`1.5px solid ${T.blue}44`,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,gap:10}}>
            <div style={{fontSize:20,fontWeight:700,color:T.navy,textAlign:"center"}}>{item.meaning}</div>
            {item.romaji&&<div style={{fontSize:13,color:T.textMid}}>{item.romaji}</div>}
            {item.breakdown&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:4}}>
                {item.breakdown.map((b,i)=>(
                  <div key={i} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 8px",textAlign:"center"}}>
                    <div style={{fontSize:12,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{b.word}</div>
                    <div style={{fontSize:10,color:T.textLight}}>{b.meaning}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:10}}>
        <button onClick={onPrev} disabled={idx===0}
          style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${T.border}`,background:T.white,color:idx===0?T.textLight:T.text,fontSize:13,cursor:idx===0?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          ← Prev
        </button>
        <button onClick={onNext} disabled={idx===total-1}
          style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${T.blue}`,background:T.blue,color:T.white,fontSize:13,cursor:idx===total-1?"default":"pointer",opacity:idx===total-1?0.5:1,fontFamily:"'DM Sans',sans-serif"}}>
          Next →
        </button>
      </div>
    </div>
  );
}

function LevelTestPanel({level,onComplete}){
  const [questions]=useState(()=>shuffle(levelTests[level]||[]));
  const [idx,setIdx]=useState(0);
  const [selected,setSelected]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  if(!questions.length)return<div style={{color:T.textLight,textAlign:"center",padding:32}}>Tidak ada soal.</div>;
  const q=questions[idx];
  const handleAnswer=(opt)=>{
    if(selected)return;
    setSelected(opt);
    const correct=opt===q.answer;
    if(correct)setScore(s=>s+1);
    setTimeout(()=>{
      if(idx+1>=questions.length)setDone(true);
      else{setIdx(i=>i+1);setSelected(null);}
    },900);
  };
  if(done){
    const pct=score/questions.length;
    const passed=pct>=0.7;
    return(
      <div style={{textAlign:"center",padding:"28px 0"}}>
        <div style={{fontSize:44,marginBottom:12}}>{passed?"🎉":"📚"}</div>
        <div style={{fontSize:20,fontWeight:700,color:passed?T.green:T.yellow,marginBottom:8}}>
          {passed?"Level Up!":"Terus Berlatih"}
        </div>
        <div style={{fontSize:14,color:T.textMid,marginBottom:20}}>
          Skor: {score}/{questions.length} ({Math.round(pct*100)}%)
          {passed?" — Kamu lulus!":" — Butuh 70% untuk lulus."}
        </div>
        <button onClick={()=>onComplete(passed,score,questions.length)}
          style={{padding:"12px 28px",borderRadius:12,border:"none",background:T.blue,color:T.white,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:"100%"}}>
          {passed?"Lanjutkan →":"Kembali Belajar"}
        </button>
      </div>
    );
  }
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textLight,marginBottom:8}}>
        <span>Level Test — {level}</span><span>Soal {idx+1}/{questions.length}</span>
      </div>
      <ProgressBar value={idx} max={questions.length}/>
      <Card style={{margin:"14px 0"}}>
        <div style={{fontSize:10,color:T.textLight,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{q.type}</div>
        <div style={{fontSize:15,color:T.navy,lineHeight:1.6}}>{q.question}</div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        {q.options.map(opt=>{
          let bg=T.white,border=T.border,color=T.text;
          if(selected){
            if(opt===q.answer){bg=T.greenPale;border=T.green;color=T.green;}
            else if(opt===selected){bg=T.redPale;border=T.red;color=T.red;}
          }
          return(
            <button key={opt} onClick={()=>handleAnswer(opt)}
              style={{padding:"13px 10px",borderRadius:10,border:`1.5px solid ${border}`,background:bg,color,fontSize:13,cursor:selected?"default":"pointer",transition:"all 0.18s",fontFamily:"'DM Sans',sans-serif"}}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HiraganaSection({progress,onUpdateProgress,onXP}){
  const [subTab,setSubTab]=useState("chart");
  const [selectedGroup,setSelectedGroup]=useState(null);
  const [flashQueue,setFlashQueue]=useState(()=>shuffle(allHiragana));
  const [flashIdx,setFlashIdx]=useState(0);
  const [flashFlipped,setFlashFlipped]=useState(false);
  const [writeChar,setWriteChar]=useState(allHiragana[0]);
  const canvasRef=useRef(null);
  const activeChars=selectedGroup?hiraganaGroups.find(g=>g.group===selectedGroup)?.chars||allHiragana:allHiragana;
  const masteredCount=allHiragana.filter(c=>{const p=progress[`kana_${c.k}`];return p&&p.attempts>=3&&p.correct/p.attempts>=0.8;}).length;
  const mc=(kana)=>masteryColor(progress[`kana_${kana}`]);
  const clearCanvas=()=>{const c=canvasRef.current;if(c)c.getContext("2d").clearRect(0,0,c.width,c.height);};
  useEffect(()=>{clearCanvas();},[writeChar]);
  let drawing=false,lastPos=null;
  const attachCanvas=(canvas)=>{
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const gp=(e)=>{const r=canvas.getBoundingClientRect();const t=e.touches?.[0];return{x:(t?t.clientX:e.clientX)-r.left,y:(t?t.clientY:e.clientY)-r.top};};
    canvas.onmousedown=canvas.ontouchstart=(e)=>{e.preventDefault();drawing=true;lastPos=gp(e);};
    canvas.onmousemove=canvas.ontouchmove=(e)=>{e.preventDefault();if(!drawing)return;const pos=gp(e);ctx.beginPath();ctx.moveTo(lastPos.x,lastPos.y);ctx.lineTo(pos.x,pos.y);ctx.strokeStyle=T.blue;ctx.lineWidth=3;ctx.lineCap="round";ctx.stroke();lastPos=pos;};
    canvas.onmouseup=canvas.onmouseleave=canvas.ontouchend=()=>{drawing=false;};
  };
  return(
    <div>
      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {["chart","flashcard","quiz","write"].map(t=>(
          <PillBtn key={t} active={subTab===t} onClick={()=>setSubTab(t)} style={{textTransform:"capitalize",fontSize:12}}>{t}</PillBtn>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:T.textLight}}>{masteredCount}/{allHiragana.length}</span>
      </div>
      {(subTab==="chart"||subTab==="quiz"||subTab==="flashcard")&&(
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          <PillBtn active={selectedGroup===null} onClick={()=>{setSelectedGroup(null);if(subTab==="flashcard"){setFlashQueue(shuffle(allHiragana));setFlashIdx(0);}}} style={{fontSize:10,padding:"3px 10px"}}>Semua</PillBtn>
          {hiraganaGroups.map(g=>(
            <PillBtn key={g.group} active={selectedGroup===g.group} onClick={()=>{setSelectedGroup(g.group);if(subTab==="flashcard"){setFlashQueue(shuffle(g.chars));setFlashIdx(0);}}} style={{fontSize:10,padding:"3px 10px"}}>{g.group}</PillBtn>
          ))}
        </div>
      )}
      {subTab==="chart"&&(
        <div>
          {(selectedGroup?[hiraganaGroups.find(g=>g.group===selectedGroup)]:hiraganaGroups).map(group=>(
            <div key={group.group} style={{marginBottom:18}}>
              <div style={{fontSize:12,marginBottom:7}}><b style={{color:T.navy}}>{group.group}</b><span style={{color:T.textLight,marginLeft:8,fontSize:10}}>{group.romaji}</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(62px,1fr))",gap:5}}>
                {group.chars.map(c=>(
                  <div key={c.k} onClick={()=>{setWriteChar(c);setSubTab("write");}}
                    style={{background:T.white,border:`1.5px solid ${mc(c.k)}44`,borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:"pointer",position:"relative",transition:"all 0.15s"}}>
                    {progress[`kana_${c.k}`]?.attempts>0&&<div style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:mc(c.k)}}/>}
                    <div style={{fontSize:22,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{c.k}</div>
                    <div style={{fontSize:9,color:T.textLight,marginTop:1}}>{c.r}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {subTab==="flashcard"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,color:T.textLight}}>{flashIdx+1} / {flashQueue.length}</span>
            <button onClick={()=>{setFlashQueue(shuffle(activeChars));setFlashIdx(0);setFlashFlipped(false);}}
              style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${T.border}`,background:T.white,color:T.textMid,fontSize:11,cursor:"pointer"}}>↺ Acak</button>
          </div>
          <div onClick={()=>setFlashFlipped(f=>!f)} style={{perspective:1000,cursor:"pointer",height:200,marginBottom:16}}>
            <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(.4,0,.2,1)",transform:flashFlipped?"rotateY(180deg)":"rotateY(0deg)"}}>
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:T.navy,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:80,fontFamily:"'Noto Sans JP',sans-serif",color:T.white,lineHeight:1}}>{flashQueue[flashIdx]?.k}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:8}}>tap untuk lihat</div>
              </div>
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:T.bluePale,border:`1.5px solid ${T.blue}44`,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                <div style={{fontSize:52,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{flashQueue[flashIdx]?.k}</div>
                <div style={{fontSize:26,fontWeight:700,color:T.blue}}>{flashQueue[flashIdx]?.r}</div>
                {mnemonics[flashQueue[flashIdx]?.k]&&<div style={{fontSize:11,color:T.textMid,textAlign:"center",maxWidth:220,padding:"0 16px",lineHeight:1.6}}>{mnemonics[flashQueue[flashIdx]?.k]}</div>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setFlashIdx(i=>Math.max(0,i-1));setFlashFlipped(false);}} disabled={flashIdx===0}
              style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${T.border}`,background:T.white,color:flashIdx===0?T.textLight:T.text,fontSize:13,cursor:flashIdx===0?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Prev</button>
            <button onClick={()=>{setFlashIdx(i=>Math.min(flashQueue.length-1,i+1));setFlashFlipped(false);}} disabled={flashIdx===flashQueue.length-1}
              style={{flex:1,padding:"11px",borderRadius:10,border:`1px solid ${T.blue}`,background:T.blue,color:T.white,fontSize:13,cursor:flashIdx===flashQueue.length-1?"default":"pointer",opacity:flashIdx===flashQueue.length-1?0.5:1,fontFamily:"'DM Sans',sans-serif"}}>Next →</button>
          </div>
        </div>
      )}
      {subTab==="quiz"&&(
        <QuizPanel items={activeChars.map(c=>({id:`kana_${c.k}`,kana:c.k,romaji:c.r,meaning:c.r}))}
          onAnswer={(item,correct)=>{
            const prev=progress[item.id]||{correct:0,attempts:0};
            onUpdateProgress(item.id,"kana",prev.correct+(correct?1:0),prev.attempts+1);
            if(correct)onXP(XP_REWARDS.quiz_correct,"Quiz benar");
          }}/>
      )}
      {subTab==="write"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(42px,1fr))",gap:5,marginBottom:14,maxHeight:120,overflowY:"auto"}}>
            {allHiragana.map(c=>(
              <button key={c.k} onClick={()=>setWriteChar(c)}
                style={{padding:"6px 2px",borderRadius:7,border:`1.5px solid ${writeChar.k===c.k?T.blue:T.border}`,background:writeChar.k===c.k?T.bluePale:T.white,color:T.navy,fontSize:16,fontFamily:"'Noto Sans JP',sans-serif",cursor:"pointer"}}>
                {c.k}
              </button>
            ))}
          </div>
          <div style={{textAlign:"center",fontSize:12,color:T.textLight,marginBottom:8}}>Tulis: {writeChar.k} ({writeChar.r})</div>
          <div style={{position:"relative",display:"flex",justifyContent:"center"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:130,color:`${T.navy}07`,fontFamily:"'Noto Sans JP',sans-serif",pointerEvents:"none",lineHeight:1}}>{writeChar.k}</div>
            <canvas ref={el=>{canvasRef.current=el;attachCanvas(el);}} width={260} height={260}
              style={{border:`1.5px solid ${T.border}`,borderRadius:14,cursor:"crosshair",background:T.white,touchAction:"none"}}/>
          </div>
          <div style={{textAlign:"center",marginTop:10}}>
            <button onClick={clearCanvas} style={{padding:"6px 16px",borderRadius:7,border:`1px solid ${T.border}`,background:T.white,color:T.textMid,fontSize:12,cursor:"pointer"}}>Hapus</button>
          </div>
          {mnemonics[writeChar.k]&&<Card style={{marginTop:12,fontSize:12,color:T.textMid,lineHeight:1.7}}>{mnemonics[writeChar.k]}</Card>}
        </div>
      )}
    </div>
  );
}

function CatTab({profile,onNameChange}){
  const catLevel=profile?.cat_level||1;
  const xp=profile?.xp||0;
  const stage=catLevel<=10?"kitten":catLevel<=20?"teen":"adult";
  const stageLabel=catLevel<=10?"Kitten":catLevel<=20?"Remaja":"Adult Cat";
  const {current,needed,pct}=getXPProgress(xp,catLevel);
  const [mood,setMood]=useState("happy");
  const [editingName,setEditingName]=useState(false);
  const [nameInput,setNameInput]=useState(profile?.cat_name||"Neko-chan");

  const moodEmoji={happy:"😸",sleep:"😴",bored:"😒"};

  return(
    <div>
      <Card style={{textAlign:"center",marginBottom:14,padding:"24px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
          <CatAvatar catLevel={catLevel} mood={mood} size={140} animate={true}/>
        </div>
        {editingName?(
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:8}}>
            <input value={nameInput} onChange={e=>setNameInput(e.target.value)}
              style={{padding:"6px 12px",borderRadius:8,border:`1.5px solid ${T.blue}`,fontSize:14,color:T.navy,fontFamily:"'DM Sans',sans-serif",width:140,outline:"none"}}/>
            <button onClick={()=>{setEditingName(false);onNameChange&&onNameChange(nameInput);}}
              style={{padding:"6px 12px",borderRadius:8,border:"none",background:T.blue,color:T.white,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✓</button>
          </div>
        ):(
          <div onClick={()=>setEditingName(true)} style={{fontSize:17,fontWeight:600,color:T.navy,marginBottom:4,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
            {nameInput} <span style={{fontSize:12,color:T.textLight}}>✎</span>
          </div>
        )}
        <div style={{fontSize:12,color:T.textMid,marginBottom:12}}>Level {catLevel} · {stageLabel}</div>
        <div style={{marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.textLight,marginBottom:5}}>
            <span>{current} XP</span><span>{needed} XP untuk level up</span>
          </div>
          <ProgressBar value={pct} max={100} color={stage==="kitten"?T.blue:stage==="teen"?"#E8960C":T.navy}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:14}}>
          {Object.entries(moodEmoji).map(([m,emoji])=>(
            <button key={m} onClick={()=>setMood(m)}
              style={{padding:"6px 14px",borderRadius:999,border:`1.5px solid ${mood===m?T.blue:T.border}`,background:mood===m?T.bluePale:T.white,fontSize:13,cursor:"pointer",transition:"all 0.15s"}}>
              {emoji} {m==="happy"?"Senang":m==="sleep"?"Tidur":"Bosan"}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:12}}>Milestone</div>
        {[
          {level:1,label:"Mulai perjalanan",done:catLevel>=1,emoji:"🐾"},
          {level:5,label:"Kitten makin pintar",done:catLevel>=5,emoji:"📚"},
          {level:10,label:"Lulus Kitten stage",done:catLevel>=10,emoji:"🎓"},
          {level:11,label:"Memasuki Remaja",done:catLevel>=11,emoji:"✨"},
          {level:20,label:"Lulus Remaja stage",done:catLevel>=20,emoji:"🏆"},
          {level:21,label:"Kucing dewasa",done:catLevel>=21,emoji:"👑"},
          {level:30,label:"Master Nihongo",done:catLevel>=30,emoji:"🎌"},
        ].map(m=>(
          <div key={m.level} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`,opacity:m.done?1:0.4}}>
            <div style={{width:28,height:28,borderRadius:8,background:m.done?T.bluePale:T.blueFaint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
              {m.done?m.emoji:"🔒"}
            </div>
            <div>
              <div style={{fontSize:13,color:m.done?T.navy:T.textLight,fontWeight:m.done?500:400}}>{m.label}</div>
              <div style={{fontSize:10,color:T.textLight}}>Level {m.level}</div>
            </div>
            {m.done&&<div style={{marginLeft:"auto",fontSize:10,color:T.green,fontWeight:500}}>✓ Done</div>}
          </div>
        ))}
      </Card>

      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:10}}>Stats</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {label:"Total XP",value:xp},
            {label:"Cat Level",value:catLevel},
            {label:"Streak",value:`${profile?.streak||0}d`},
          ].map(s=>(
            <div key={s.label} style={{background:T.blueFaint,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:600,color:T.navy}}>{s.value}</div>
              <div style={{fontSize:10,color:T.textLight,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AppInner(){
  const {user,profile,loading,signOut,refreshProfile}=useAuth();
  const router=useRouter();
  const [mainTab,setMainTab]=useState("learn");
  const [learnSection,setLearnSection]=useState("vocab");
  const [learnMode,setLearnMode]=useState("flashcard");
  const [progress,setProgress]=useState({});
  const [progLoading,setProgLoading]=useState(true);
  const [flashItems,setFlashItems]=useState([]);
  const [flashIdx,setFlashIdx]=useState(0);
  const [toast,setToast]=useState({visible:false,message:""});
  const [levelUpModal,setLevelUpModal]=useState({show:false,catLevel:1});

  useEffect(()=>{if(!loading&&!user)router.replace("/login");},[user,loading]);
  useEffect(()=>{if(!loading&&user&&profile&&!profile.placement_done)router.replace("/placement");},[user,profile,loading]);
  useEffect(()=>{
    if(user){
      getProgress(user.id).then(p=>{setProgress(p);setProgLoading(false);});
      checkAndUpdateStreak(user.id).then(({streak,bonus})=>{
        if(bonus>0){
          showToast(`Streak ${streak} hari! +${bonus} bonus XP`);
          handleXP(bonus,`Streak bonus ${streak} hari`);
        } else {
          handleXP(XP_REWARDS.daily_login,"Daily login");
          showToast("+20 XP — Daily login!");
        }
      });
    }
  },[user]);

  const level=profile?.level||"beginner";
  const vocabItems=vocabulary[level]||[];
  const phraseItems=phrases[level]||[];
  const sentenceItems=sentences[level]||[];

  useEffect(()=>{
    const map={vocab:vocabItems,phrases:phraseItems,sentences:sentenceItems};
    setFlashItems(shuffle(map[learnSection]||vocabItems));
    setFlashIdx(0);
  },[learnSection,level]);

  const showToast=(msg)=>{
    setToast({visible:true,message:msg});
  };

  const handleXP=useCallback(async(amount,reason)=>{
    if(!user)return;
    const result=await addXP(user.id,amount,reason);
    if(result?.leveledUp){
      setLevelUpModal({show:true,catLevel:result.newCatLevel});
    }
    await refreshProfile();
  },[user]);

  const handleUpdateProgress=useCallback(async(itemId,itemType,correct,attempts)=>{
    setProgress(prev=>({...prev,[itemId]:{...prev[itemId],correct,attempts}}));
    if(user)await upsertProgress(user.id,itemId,itemType,correct,attempts);
  },[user]);

  const handleLevelTestComplete=async(passed,score,total)=>{
    if(!user)return;
    const nextLevel={beginner:"elementary",elementary:"intermediate"};
    await saveLevelTest(user.id,level,score,total,passed);
    if(passed){
      if(nextLevel[level]){await updateLevel(user.id,nextLevel[level]);}
      await handleXP(XP_REWARDS.level_test_pass,"Level test lulus");
      showToast("Level test lulus! +300 XP");
      await refreshProfile();
    }
    setLearnSection("vocab");
  };

  const handleCatNameChange=async(name)=>{
    if(!user)return;
    const {supabase}=await import("../lib/supabase");
    await supabase.from("profiles").update({cat_name:name}).eq("id",user.id);
    await refreshProfile();
  };

  const masteredVocab=vocabItems.filter(v=>{const p=progress[v.id];return p&&p.attempts>=3&&p.correct/p.attempts>=0.8;}).length;
  const levelColors={beginner:T.green,elementary:T.yellow,intermediate:T.blue};
  const levelLabels={beginner:"Beginner",elementary:"Elementary",intermediate:"Intermediate"};
  const currentItems={vocab:vocabItems,phrases:phraseItems,sentences:sentenceItems}[learnSection]||[];

  if(loading||progLoading)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.blueFaint}}>
      <div style={{color:T.textLight,fontSize:14}}>Loading...</div>
    </div>
  );
  if(!user||!profile)return null;

  const mainTabs=[
    {id:"learn",label:"Belajar",icon:"📖"},
    {id:"hiragana",label:"Hiragana",icon:"あ"},
    {id:"cat",label:"Kucing",icon:"🐱"},
    {id:"progress",label:"Progress",icon:"📊"},
  ];

  const learnSections=[
    {id:"vocab",label:"Vocabulary"},
    {id:"phrases",label:"Phrases"},
    {id:"sentences",label:"Sentences"},
    ...(level!=="intermediate"?[{id:"leveltest",label:"Level Test"}]:[]),
  ];

  return(
    <>
      <Head><title>Nihongo Master</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.blueFaint};font-family:'DM Sans',sans-serif;color:${T.navy};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.3s ease}
      `}</style>

      <div style={{maxWidth:480,margin:"0 auto",padding:"0 16px 100px",minHeight:"100vh"}}>
        {/* Header */}
        <header style={{padding:"16px 0 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <CatAvatar catLevel={profile?.cat_level||1} mood="happy" size={32} animate={false}/>
            <div>
              <div style={{fontSize:11,color:T.textLight,lineHeight:1}}>{profile.display_name||profile.email?.split("@")[0]}</div>
              <div style={{fontSize:10,color:T.blue,fontWeight:600}}>{profile.xp||0} XP · Lv.{profile.cat_level||1}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:levelColors[level]+"22",color:levelColors[level],fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:999,border:`1px solid ${levelColors[level]}44`}}>
              {levelLabels[level]}
            </div>
            {profile.streak>0&&(
              <div style={{background:"#FEF3DC",color:T.yellow,fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:999,border:`1px solid ${T.yellow}44`}}>
                🔥 {profile.streak}
              </div>
            )}
            <button onClick={signOut}
              style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${T.border}`,background:T.white,color:T.textLight,fontSize:11,cursor:"pointer"}}>
              Keluar
            </button>
          </div>
        </header>

        {/* Main content */}
        <div>
          {mainTab==="learn"&&(
            <div className="fade-up">
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {learnSections.map(s=>(
                  <PillBtn key={s.id} active={learnSection===s.id} onClick={()=>setLearnSection(s.id)} style={{fontSize:12}}>{s.label}</PillBtn>
                ))}
              </div>
              {learnSection==="leveltest"?(
                <LevelTestPanel level={level} onComplete={handleLevelTestComplete}/>
              ):(
                <>
                  <div style={{display:"flex",gap:6,marginBottom:14,alignItems:"center"}}>
                    {["flashcard","quiz"].map(m=>(
                      <PillBtn key={m} active={learnMode===m} onClick={()=>setLearnMode(m)} style={{textTransform:"capitalize",fontSize:11,padding:"5px 14px"}}>{m}</PillBtn>
                    ))}
                    <span style={{marginLeft:"auto",fontSize:11,color:T.textLight}}>{currentItems.length} item</span>
                  </div>
                  {learnMode==="flashcard"?(
                    <Flashcard item={flashItems[flashIdx]} idx={flashIdx} total={flashItems.length} progress={progress}
                      onNext={()=>setFlashIdx(i=>Math.min(flashItems.length-1,i+1))}
                      onPrev={()=>setFlashIdx(i=>Math.max(0,i-1))}/>
                  ):(
                    <QuizPanel items={currentItems} onAnswer={(item,correct)=>{
                      const prev=progress[item.id]||{correct:0,attempts:0};
                      handleUpdateProgress(item.id,learnSection==="vocab"?"vocab":learnSection==="phrases"?"phrase":"sentence",prev.correct+(correct?1:0),prev.attempts+1);
                      if(correct){handleXP(XP_REWARDS.quiz_correct,"Quiz benar");showToast("+10 XP!");}
                    }}/>
                  )}
                </>
              )}
            </div>
          )}

          {mainTab==="hiragana"&&(
            <div className="fade-up">
              <HiraganaSection progress={progress} onUpdateProgress={handleUpdateProgress}
                onXP={(amount,reason)=>{handleXP(amount,reason);showToast(`+${amount} XP!`);}}/>
            </div>
          )}

          {mainTab==="cat"&&(
            <div className="fade-up">
              <CatTab profile={profile} onNameChange={handleCatNameChange}/>
            </div>
          )}

          {mainTab==="progress"&&(
            <div className="fade-up">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {[
                  {label:"Level",value:levelLabels[level],color:levelColors[level]},
                  {label:"Cat Level",value:`Lv. ${profile?.cat_level||1}`,color:T.blue},
                  {label:"Vocab",value:`${masteredVocab}/${vocabItems.length}`,color:T.green},
                  {label:"Streak",value:`${profile?.streak||0} hari`,color:T.yellow},
                ].map(s=>(
                  <Card key={s.label}>
                    <div style={{fontSize:10,color:T.textLight,marginBottom:4}}>{s.label}</div>
                    <div style={{fontSize:20,fontWeight:700,color:s.color}}>{s.value}</div>
                  </Card>
                ))}
              </div>
              <Card style={{marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:8}}>Vocab Progress</div>
                <ProgressBar value={masteredVocab} max={vocabItems.length}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:10}}>
                  {vocabItems.map(v=>{
                    const p=progress[v.id];
                    const mc=masteryColor(p);
                    return(
                      <div key={v.id} style={{background:T.blueFaint,border:`1px solid ${mc}33`,borderRadius:8,padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:13,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{v.kana}</div>
                          <div style={{fontSize:9,color:T.textLight}}>{v.meaning}</div>
                        </div>
                        <div style={{width:6,height:6,borderRadius:"50%",background:mc}}/>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:T.white,borderTop:`1px solid ${T.border}`,padding:"8px 16px 12px",display:"flex",justifyContent:"space-around",zIndex:100,maxWidth:480,margin:"0 auto"}}>
        {mainTabs.map(t=>(
          <button key={t.id} onClick={()=>setMainTab(t.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 12px",borderRadius:10,border:"none",background:mainTab===t.id?T.bluePale:"transparent",cursor:"pointer",minWidth:60,transition:"all 0.15s"}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:10,color:mainTab===t.id?T.blue:T.textLight,fontWeight:mainTab===t.id?600:400,fontFamily:"'DM Sans',sans-serif"}}>{t.label}</span>
          </button>
        ))}
      </nav>

      <XPToast message={toast.message} visible={toast.visible} onHide={()=>setToast(t=>({...t,visible:false}))}/>
      <LevelUpModal show={levelUpModal.show} catLevel={levelUpModal.catLevel} onClose={()=>setLevelUpModal({show:false,catLevel:1})}/>
    </>
  );
}

export default function Home(){
  return <AuthProvider><AppInner/></AuthProvider>;
}
