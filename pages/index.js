import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthProvider, useAuth } from "../lib/auth";
import { getProgress, upsertProgress, updateLevel, saveLevelTest, masteryColor } from "../lib/progress";
import { addXP, checkAndUpdateStreak, getXPProgress, XP_REWARDS } from "../lib/xp";
import { hiraganaGroups, allHiragana, mnemonics } from "../data/hiragana";
import { vocabulary, phrases, sentences, levelTests } from "../data/content";
import CatAvatar from "../components/CatAvatar";
import KanaWord from "../components/KanaWord";
import XPToast from "../components/XPToast";
import LevelUpModal from "../components/LevelUpModal";

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

const T={
  navy:"#0D2B5E",blue:"#1E88E5",bluePale:"#E3EDF8",blueFaint:"#F0F4FB",
  text:"#0D2B5E",textMid:"#5A7BA8",textLight:"#8BADD4",border:"#D0DFF0",white:"#FFFFFF",
  green:"#1D9E75",greenPale:"#E1F5EE",yellow:"#E8960C",yellowPale:"#FEF3DC",
  red:"#E53935",redPale:"#FEF0F0",
};

function useIsMobile(){
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{
    const check=()=>setMobile(window.innerWidth<768);
    check();
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);
  return mobile;
}

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
      fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",...style
    }}>{children}</button>
  );
}

// Vocab flashcard with per-syllable display
function VocabFlashcard({item,idx,total,progress,onNext,onPrev}){
  const [flipped,setFlipped]=useState(false);
  useEffect(()=>setFlipped(false),[item]);
  if(!item)return null;
  const p=progress[item.id];
  const mc=masteryColor(p);
  const isVocab=!!item.kana;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:12,color:T.textLight}}>{idx+1} / {total}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:mc}}/>
          <span style={{fontSize:11,color:T.textLight}}>{p?`${p.correct}/${p.attempts}`:"baru"}</span>
        </div>
      </div>
      <div onClick={()=>setFlipped(f=>!f)} style={{perspective:1000,cursor:"pointer",height:210,marginBottom:18}}>
        <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
          {/* Front */}
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:T.navy,borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:24}}>
            {isVocab?(
              <KanaWord text={item.kana} fontSize={36} romaSize={14} color={T.white} romaColor="rgba(255,255,255,0.45)" gap={10}/>
            ):(
              <div style={{fontSize:18,fontFamily:"'Noto Sans JP',sans-serif",color:T.white,lineHeight:1.6,textAlign:"center"}}>{item.japanese}</div>
            )}
            {item.category&&<div style={{fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{item.category}</div>}
            <div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>tap untuk lihat arti</div>
          </div>
          {/* Back */}
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:T.bluePale,border:`1.5px solid ${T.blue}33`,borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:10}}>
            <div style={{fontSize:24,fontWeight:700,color:T.navy,textAlign:"center"}}>{item.meaning}</div>
            {isVocab&&<KanaWord text={item.kana} fontSize={22} romaSize={12} color={T.textMid} romaColor={T.textLight} gap={7}/>}
            {item.breakdown&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:4}}>
                {item.breakdown.map((b,i)=>(
                  <div key={i} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 8px",textAlign:"center"}}>
                    <div style={{fontSize:13,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{b.word}</div>
                    <div style={{fontSize:10,color:T.textLight}}>{b.meaning}</div>
                  </div>
                ))}
              </div>
            )}
            {item.situation&&<div style={{fontSize:11,color:T.textLight,background:T.white,padding:"3px 10px",borderRadius:999,border:`1px solid ${T.border}`}}>{item.situation}</div>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onPrev} disabled={idx===0}
          style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${T.border}`,background:T.white,color:idx===0?T.textLight:T.text,fontSize:13,cursor:idx===0?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Prev</button>
        <button onClick={onNext} disabled={idx===total-1}
          style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${T.blue}`,background:T.blue,color:T.white,fontSize:13,cursor:idx===total-1?"default":"pointer",opacity:idx===total-1?0.5:1,fontFamily:"'DM Sans',sans-serif"}}>Next →</button>
      </div>
    </div>
  );
}

// Quiz with per-syllable display
function QuizPanel({items,onAnswer}){
  const [q,setQ]=useState(null);
  const [selected,setSelected]=useState(null);
  const [streak,setStreak]=useState(0);
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
    const correct=opt.id===q.correct.id;
    if(correct)setStreak(s=>s+1); else setStreak(0);
    onAnswer&&onAnswer(q.correct,correct);
    setTimeout(()=>makeQ(),1000);
  };
  return(
    <div>
      {streak>=3&&<div style={{textAlign:"center",marginBottom:10,fontSize:13,color:T.yellow,fontWeight:600}}>🔥 {streak} benar berturut-turut!</div>}
      <Card style={{textAlign:"center",marginBottom:14,padding:"32px 20px"}}>
        {q.correct.kana?(
          <KanaWord text={q.correct.kana} fontSize={44} romaSize={0} color={T.navy} gap={8}/>
        ):(
          <div style={{fontSize:18,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy,lineHeight:1.6}}>{q.correct.japanese}</div>
        )}
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
              style={{padding:"14px 10px",borderRadius:12,border:`1.5px solid ${border}`,background:bg,color,fontSize:13,cursor:selected?"default":"pointer",transition:"all 0.18s",fontWeight:500,fontFamily:"'DM Sans',sans-serif",lineHeight:1.4}}>
              {opt.meaning}
            </button>
          );
        })}
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
    if(opt===q.answer)setScore(s=>s+1);
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
        <div style={{fontSize:20,fontWeight:700,color:passed?T.green:T.yellow,marginBottom:8}}>{passed?"Level Up!":"Terus Berlatih"}</div>
        <div style={{fontSize:14,color:T.textMid,marginBottom:20}}>Skor: {score}/{questions.length} ({Math.round(pct*100)}%){passed?" — Lulus!":" — Butuh 70%."}</div>
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
        <span>Level Test</span><span>{idx+1}/{questions.length}</span>
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
                    style={{background:T.white,border:`1.5px solid ${mc(c.k)}44`,borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:"pointer",position:"relative"}}>
                    {progress[`kana_${c.k}`]?.attempts>0&&<div style={{position:"absolute",top:3,right:3,width:5,height:5,borderRadius:"50%",background:mc(c.k)}}/>}
                    <div style={{fontSize:22,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{c.k}</div>
                    <div style={{fontSize:10,color:T.textLight,marginTop:2}}>{c.r}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {subTab==="flashcard"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:12,color:T.textLight}}>{flashIdx+1} / {flashQueue.length}</span>
            <button onClick={()=>{setFlashQueue(shuffle(activeChars));setFlashIdx(0);setFlashFlipped(false);}}
              style={{padding:"4px 12px",borderRadius:7,border:`1px solid ${T.border}`,background:T.white,color:T.textMid,fontSize:11,cursor:"pointer"}}>↺ Acak</button>
          </div>
          <div onClick={()=>setFlashFlipped(f=>!f)} style={{perspective:1000,cursor:"pointer",height:200,marginBottom:16}}>
            <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(.4,0,.2,1)",transform:flashFlipped?"rotateY(180deg)":"rotateY(0deg)"}}>
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:T.navy,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:80,fontFamily:"'Noto Sans JP',sans-serif",color:T.white,lineHeight:1}}>{flashQueue[flashIdx]?.k}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:8}}>tap untuk lihat</div>
              </div>
              <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:T.bluePale,border:`1.5px solid ${T.blue}33`,borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
                <div style={{fontSize:52,fontFamily:"'Noto Sans JP',sans-serif",color:T.navy}}>{flashQueue[flashIdx]?.k}</div>
                <div style={{fontSize:28,fontWeight:700,color:T.blue}}>{flashQueue[flashIdx]?.r}</div>
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
  return(
    <div>
      <Card style={{textAlign:"center",marginBottom:14,padding:"24px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
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
            {nameInput}<span style={{fontSize:12,color:T.textLight}}>✎</span>
          </div>
        )}
        <div style={{fontSize:12,color:T.textMid,marginBottom:14}}>Level {catLevel} · {stageLabel}</div>
        <div style={{marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.textLight,marginBottom:5}}>
            <span>{current} XP</span><span>{needed} XP lagi</span>
          </div>
          <ProgressBar value={pct} max={100} color={stage==="kitten"?T.blue:stage==="teen"?T.yellow:T.navy}/>
        </div>
        <div style={{display:"flex",gap:7,justifyContent:"center",marginTop:14,flexWrap:"wrap"}}>
          {[["happy","😸","Senang"],["sleep","😴","Tidur"],["bored","😒","Bosan"]].map(([m,e,l])=>(
            <button key={m} onClick={()=>setMood(m)}
              style={{padding:"6px 12px",borderRadius:999,border:`1.5px solid ${mood===m?T.blue:T.border}`,background:mood===m?T.bluePale:T.white,fontSize:12,cursor:"pointer",transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif"}}>
              {e} {l}
            </button>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:12}}>Milestone</div>
        {[
          {level:1,label:"Mulai perjalanan",emoji:"🐾"},
          {level:5,label:"Kitten makin pintar",emoji:"📚"},
          {level:10,label:"Lulus Kitten stage",emoji:"🎓"},
          {level:11,label:"Memasuki Remaja",emoji:"✨"},
          {level:20,label:"Lulus Remaja stage",emoji:"🏆"},
          {level:21,label:"Kucing dewasa",emoji:"👑"},
          {level:30,label:"Master Nihongo",emoji:"🎌"},
        ].map(m=>(
          <div key={m.level} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`,opacity:catLevel>=m.level?1:0.4}}>
            <div style={{width:28,height:28,borderRadius:8,background:catLevel>=m.level?T.bluePale:T.blueFaint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
              {catLevel>=m.level?m.emoji:"🔒"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:catLevel>=m.level?T.navy:T.textLight,fontWeight:catLevel>=m.level?500:400}}>{m.label}</div>
              <div style={{fontSize:10,color:T.textLight}}>Level {m.level}</div>
            </div>
            {catLevel>=m.level&&<span style={{fontSize:10,color:T.green,fontWeight:500}}>✓</span>}
          </div>
        ))}
      </Card>
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:10}}>Stats</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[{label:"Total XP",value:xp},{label:"Cat Level",value:catLevel},{label:"Streak",value:`${profile?.streak||0}d`}].map(s=>(
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
  const isMobile=useIsMobile();
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
        if(bonus>0){showToast(`Streak ${streak} hari! +${bonus} XP`);handleXP(bonus,`Streak bonus`);}
        else{handleXP(XP_REWARDS.daily_login,"Daily login");showToast("+20 XP — Selamat datang!");}
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

  const showToast=(msg)=>setToast({visible:true,message:msg});

  const handleXP=useCallback(async(amount,reason)=>{
    if(!user)return;
    const result=await addXP(user.id,amount,reason);
    if(result?.leveledUp)setLevelUpModal({show:true,catLevel:result.newCatLevel});
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
      if(nextLevel[level])await updateLevel(user.id,nextLevel[level]);
      await handleXP(XP_REWARDS.level_test_pass,"Level test lulus");
      showToast("Level test lulus! +300 XP 🎉");
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

  // Desktop sidebar nav
  const SidebarNav=()=>(
    <div style={{width:220,background:T.navy,minHeight:"100vh",padding:"24px 0",display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,bottom:0}}>
      <div style={{padding:"0 20px 24px",borderBottom:`1px solid rgba(255,255,255,0.08)`,marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <CatAvatar catLevel={profile?.cat_level||1} mood="happy" size={36} animate={false}/>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:T.white}}>{profile.display_name||profile.email?.split("@")[0]}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Lv.{profile?.cat_level||1} · {profile?.xp||0} XP</div>
          </div>
        </div>
      </div>
      {mainTabs.map(t=>(
        <button key={t.id} onClick={()=>setMainTab(t.id)}
          style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",fontSize:13,color:mainTab===t.id?"#fff":"rgba(255,255,255,0.5)",cursor:"pointer",border:"none",background:mainTab===t.id?"rgba(255,255,255,0.08)":"transparent",borderLeft:`3px solid ${mainTab===t.id?T.blue:"transparent"}`,transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif",textAlign:"left",width:"100%"}}>
          <span style={{fontSize:16}}>{t.icon}</span>{t.label}
        </button>
      ))}
      <div style={{marginTop:"auto",padding:"16px 20px",borderTop:`1px solid rgba(255,255,255,0.08)`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{background:levelColors[level]+"33",color:levelColors[level],fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:999}}>{levelLabels[level]}</div>
          {profile.streak>0&&<div style={{background:"rgba(232,150,12,0.2)",color:T.yellow,fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:999}}>🔥 {profile.streak}</div>}
        </div>
        <button onClick={signOut} style={{fontSize:11,color:"rgba(255,255,255,0.4)",background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0}}>Keluar</button>
      </div>
    </div>
  );

  const contentStyle=isMobile
    ?{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}
    :{marginLeft:220,padding:"0 40px 60px",maxWidth:900};

  return(
    <>
      <Head><title>Nihongo Master</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.blueFaint};font-family:'DM Sans',sans-serif;color:${T.navy};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.3s ease}
        button:active{opacity:0.85}
      `}</style>

      {/* Desktop sidebar */}
      {!isMobile&&<SidebarNav/>}

      <div style={contentStyle}>
        {/* Mobile header */}
        {isMobile&&(
          <header style={{padding:"14px 0 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <CatAvatar catLevel={profile?.cat_level||1} mood="happy" size={30} animate={false}/>
              <div>
                <div style={{fontSize:11,color:T.textLight,lineHeight:1}}>{profile.display_name||profile.email?.split("@")[0]}</div>
                <div style={{fontSize:10,color:T.blue,fontWeight:600}}>{profile.xp||0} XP · Lv.{profile.cat_level||1}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{background:levelColors[level]+"22",color:levelColors[level],fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:999,border:`1px solid ${levelColors[level]}33`}}>{levelLabels[level]}</div>
              {profile.streak>0&&<div style={{background:T.yellowPale,color:T.yellow,fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:999}}>🔥{profile.streak}</div>}
            </div>
          </header>
        )}

        {/* Desktop page title */}
        {!isMobile&&(
          <div style={{padding:"28px 0 20px"}}>
            <div style={{fontSize:22,fontWeight:700,color:T.navy}}>{mainTabs.find(t=>t.id===mainTab)?.label}</div>
          </div>
        )}

        {/* Content */}
        <div style={{paddingTop:isMobile?0:0}}>
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
                  {/* Desktop: 2 column layout */}
                  <div style={!isMobile?{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}:{}}>
                    <div>
                      {learnMode==="flashcard"?(
                        <VocabFlashcard item={flashItems[flashIdx]} idx={flashIdx} total={flashItems.length} progress={progress}
                          onNext={()=>setFlashIdx(i=>Math.min(flashItems.length-1,i+1))}
                          onPrev={()=>setFlashIdx(i=>Math.max(0,i-1))}/>
                      ):(
                        <QuizPanel items={currentItems} onAnswer={(item,correct)=>{
                          const prev=progress[item.id]||{correct:0,attempts:0};
                          handleUpdateProgress(item.id,learnSection==="vocab"?"vocab":learnSection==="phrases"?"phrase":"sentence",prev.correct+(correct?1:0),prev.attempts+1);
                          if(correct){handleXP(XP_REWARDS.quiz_correct,"Quiz benar");showToast("+10 XP!");}
                        }}/>
                      )}
                    </div>
                    {/* Desktop: vocab list on right */}
                    {!isMobile&&(
                      <Card style={{alignSelf:"start"}}>
                        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:12}}>Daftar {learnSection}</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:400,overflowY:"auto"}}>
                          {currentItems.map((item,i)=>{
                            const p=progress[item.id];
                            const mc=masteryColor(p);
                            return(
                              <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,background:T.blueFaint,border:`1px solid ${mc}22`,cursor:"pointer"}}
                                onClick={()=>{setLearnMode("flashcard");setFlashIdx(flashItems.findIndex(f=>f.id===item.id)||i);}}>
                                <KanaWord text={item.kana||item.japanese?.slice(0,6)} fontSize={15} romaSize={9} color={T.navy} romaColor={T.textLight} gap={4}/>
                                <div style={{marginLeft:"auto",fontSize:11,color:T.textMid}}>{item.meaning}</div>
                                <div style={{width:6,height:6,borderRadius:"50%",background:mc,flexShrink:0}}/>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    )}
                  </div>
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
            <div className="fade-up" style={!isMobile?{maxWidth:480}:{}}>
              <CatTab profile={profile} onNameChange={handleCatNameChange}/>
            </div>
          )}

          {mainTab==="progress"&&(
            <div className="fade-up">
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:14}}>
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
              <Card>
                <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:8}}>Vocab Progress</div>
                <ProgressBar value={masteredVocab} max={vocabItems.length}/>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:6,marginTop:10}}>
                  {vocabItems.map(v=>{
                    const p=progress[v.id];
                    const mc=masteryColor(p);
                    return(
                      <div key={v.id} style={{background:T.blueFaint,border:`1px solid ${mc}33`,borderRadius:8,padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <KanaWord text={v.kana} fontSize={14} romaSize={9} color={T.navy} romaColor={T.textLight} gap={3}/>
                          <div style={{fontSize:9,color:T.textLight,marginTop:2}}>{v.meaning}</div>
                        </div>
                        <div style={{width:6,height:6,borderRadius:"50%",background:mc,flexShrink:0}}/>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      {isMobile&&(
        <nav style={{position:"fixed",bottom:0,left:0,right:0,background:T.white,borderTop:`1px solid ${T.border}`,padding:"8px 0 12px",display:"flex",justifyContent:"space-around",zIndex:100}}>
          {mainTabs.map(t=>(
            <button key={t.id} onClick={()=>setMainTab(t.id)}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 12px",borderRadius:10,border:"none",background:mainTab===t.id?T.bluePale:"transparent",cursor:"pointer",minWidth:60,transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontSize:18}}>{t.icon}</span>
              <span style={{fontSize:10,color:mainTab===t.id?T.blue:T.textLight,fontWeight:mainTab===t.id?600:400}}>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      <XPToast message={toast.message} visible={toast.visible} onHide={()=>setToast(t=>({...t,visible:false}))}/>
      <LevelUpModal show={levelUpModal.show} catLevel={levelUpModal.catLevel} onClose={()=>setLevelUpModal({show:false,catLevel:1})}/>
    </>
  );
}

export default function Home(){
  return <AuthProvider><AppInner/></AuthProvider>;
}
