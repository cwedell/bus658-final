// Maze renderer — 15 distinct themed maze levels.

window.MazeRenderer = (function(){

  function hashRand(r, c, salt) {
    salt = salt || 0;
    var h = (r*73856093)^(c*19349663)^(salt*83492791);
    h = (h^(h>>>13))*1274126177; h = h^(h>>>16);
    return ((h>>>0)%1000)/1000;
  }

  var THEMES = {
    '6x6-1':{ name:'Garden Maze',      bg:'#c8e8b0',path1:'#dff2cc',path2:'#d0eab8',grout:'#a8cc90',wallBase:'#3a8228',wallHi:'#5aaa3a',wallDk:'#1e5010',wallStyle:'hedge' },
    '6x6-2':{ name:'Candy Lane',       bg:'#fad0e8',path1:'#ffe8f4',path2:'#fcd4ec',grout:'#e8a8cc',wallBase:'#e8509a',wallHi:'#ff80c0',wallDk:'#a02060',wallStyle:'candy' },
    '6x6-3':{ name:'Stone Dungeon',    bg:'#2a2a3a',path1:'#3a3848',path2:'#343246',grout:'#222030',wallBase:'#686078',wallHi:'#8a8098',wallDk:'#18161e',wallStyle:'stone' },
    '6x6-4':{ name:'Desert Ruins',     bg:'#e8c888',path1:'#f0d898',path2:'#e8cc88',grout:'#c0a060',wallBase:'#c89050',wallHi:'#e8b070',wallDk:'#805820',wallStyle:'sandstone' },
    '6x6-5':{ name:'Enchanted Forest', bg:'#0e2818',path1:'#1a3a22',path2:'#163020',grout:'#0a1e10',wallBase:'#2a6a18',wallHi:'#48a030',wallDk:'#0a3008',wallStyle:'roots' },
    '7x7-1':{ name:'Lava Fields',      bg:'#1a0800',path1:'#2a0e04',path2:'#240c02',grout:'#380e00',wallBase:'#8a2000',wallHi:'#cc3800',wallDk:'#3a0800',wallStyle:'lava' },
    '7x7-2':{ name:'Crystal Caves',    bg:'#0a1a30',path1:'#102040',path2:'#0c1a38',grout:'#061020',wallBase:'#2050a0',wallHi:'#4080e0',wallDk:'#0a1840',wallStyle:'crystal' },
    '7x7-3':{ name:'Autumn Courtyard', bg:'#d0581a',path1:'#e87030',path2:'#dc6828',grout:'#b04010',wallBase:'#7a3010',wallHi:'#b05020',wallDk:'#401808',wallStyle:'brick' },
    '7x7-4':{ name:'Snowy Tundra',     bg:'#d8eaf8',path1:'#eef6ff',path2:'#e4f0fc',grout:'#b0cce0',wallBase:'#8aaac8',wallHi:'#b0cce8',wallDk:'#4a6a88',wallStyle:'ice' },
    '7x7-5':{ name:'Neon City',        bg:'#08080e',path1:'#10101c',path2:'#0c0c18',grout:'#040408',wallBase:'#1a0a30',wallHi:'#4a0a80',wallDk:'#080408',wallStyle:'neon' },
    '8x8-1':{ name:'Golden Temple',    bg:'#3a2800',path1:'#6a4a00',path2:'#5a3e00',grout:'#2a1e00',wallBase:'#c89020',wallHi:'#f0c040',wallDk:'#8a5808',wallStyle:'gold' },
    '8x8-2':{ name:'Underwater Reef',  bg:'#001830',path1:'#002040',path2:'#001c38',grout:'#000e1c',wallBase:'#006880',wallHi:'#00a8c0',wallDk:'#003040',wallStyle:'coral' },
    '8x8-3':{ name:'Haunted Manor',    bg:'#0c0810',path1:'#180e20',path2:'#140c1c',grout:'#080408',wallBase:'#3a2050',wallHi:'#5a3080',wallDk:'#100810',wallStyle:'manor' },
    '8x8-4':{ name:'Volcanic Summit',  bg:'#120400',path1:'#1e0800',path2:'#180600',grout:'#0a0200',wallBase:'#6a1800',wallHi:'#a03000',wallDk:'#280800',wallStyle:'volcanic' },
    '8x8-5':{ name:'Sky Kingdom',      bg:'#5ab0f0',path1:'#78c4f8',path2:'#6abcf4',grout:'#40a0e0',wallBase:'#e8f4ff',wallHi:'#ffffff',wallDk:'#a0c8e8',wallStyle:'cloud' },
  };

  function drawWall(ctx, x, y, w, h, r, c, theme) {
    var s=theme.wallStyle;
    if (s==='hedge') {
      var g=ctx.createLinearGradient(x,y,x,y+h);
      g.addColorStop(0,theme.wallHi);g.addColorStop(0.5,theme.wallBase);g.addColorStop(1,theme.wallDk);
      ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
      var nc=Math.max(2,Math.floor(w*h/100));
      for(var i=0;i<nc;i++){
        var lx=x+hashRand(r,c,i*3)*(w-4)+2,ly=y+hashRand(r,c,i*3+1)*(h-4)+2,lr=2.5+hashRand(r,c,i*3+2)*3.5;
        ctx.globalAlpha=0.55;ctx.fillStyle=hashRand(r,c,i)>0.5?theme.wallHi:theme.wallBase;
        ctx.beginPath();ctx.arc(lx,ly,lr,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=0.4;ctx.fillStyle=theme.wallDk;ctx.fillRect(x,y+h-Math.max(2,h*0.18),w,Math.max(2,h*0.18));ctx.globalAlpha=1;
    } else if (s==='candy') {
      ctx.fillStyle=theme.wallBase;ctx.fillRect(x,y,w,h);
      ctx.fillStyle=theme.wallHi;ctx.globalAlpha=0.45;
      var sw2=Math.max(4,Math.min(w,h)*0.28);
      for(var i=0;i<Math.max(w,h)/sw2/2+2;i++){
        ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
        ctx.fillRect(x-Math.max(w,h)+i*sw2*2,y,sw2,Math.max(w,h)*2);ctx.restore();
      }
      ctx.fillStyle='#fff';ctx.globalAlpha=0.5;
      for(var i=0;i<3;i++){ctx.beginPath();ctx.arc(x+hashRand(r,c,i+10)*w,y+hashRand(r,c,i+11)*h,1.8,0,Math.PI*2);ctx.fill();}
      ctx.globalAlpha=1;
    } else if (s==='stone') {
      var g=ctx.createLinearGradient(x,y,x+w,y+h);
      g.addColorStop(0,theme.wallHi);g.addColorStop(1,theme.wallDk);
      ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallDk;ctx.lineWidth=0.8;ctx.globalAlpha=0.55;
      var rows=Math.max(1,Math.floor(h/14));
      for(var i=1;i<rows;i++){ctx.beginPath();ctx.moveTo(x,y+i*h/rows);ctx.lineTo(x+w,y+i*h/rows);ctx.stroke();}
      if(hashRand(r,c,50)>0.5){ctx.strokeStyle=theme.wallDk;ctx.lineWidth=0.6;ctx.globalAlpha=0.45;ctx.beginPath();ctx.moveTo(x+w*0.3,y+h*0.2);ctx.lineTo(x+w*0.45,y+h*0.7);ctx.stroke();}
      ctx.globalAlpha=1;
    } else if (s==='sandstone') {
      ctx.fillStyle=theme.wallBase;ctx.fillRect(x,y,w,h);
      ctx.fillStyle=theme.wallHi;ctx.globalAlpha=0.35;ctx.fillRect(x,y,w,Math.max(2,h*0.25));
      ctx.strokeStyle=theme.wallDk;ctx.lineWidth=0.7;ctx.globalAlpha=0.4;
      for(var i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x,y+i*h/4);ctx.lineTo(x+w,y+i*h/4);ctx.stroke();}
      ctx.globalAlpha=1;
    } else if (s==='roots') {
      ctx.fillStyle=theme.wallDk;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallHi;ctx.lineWidth=1.5;ctx.globalAlpha=0.55;
      for(var i=0;i<2;i++){
        ctx.beginPath();var rx2=x+hashRand(r,c,i+30)*w;
        ctx.moveTo(rx2,y);ctx.bezierCurveTo(rx2+5,y+h*0.3,rx2-5,y+h*0.6,rx2+3,y+h);ctx.stroke();
      }
      ctx.fillStyle=theme.wallBase;ctx.globalAlpha=0.4;
      for(var i=0;i<3;i++){ctx.beginPath();ctx.arc(x+hashRand(r,c,i+40)*(w-4)+2,y+2,2+hashRand(r,c,i+41)*2,0,Math.PI*2);ctx.fill();}
      ctx.globalAlpha=1;
    } else if (s==='lava') {
      ctx.fillStyle=theme.wallDk;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallHi;ctx.lineWidth=1;ctx.globalAlpha=0.65;
      for(var i=0;i<2;i++){var ly2=y+hashRand(r,c,i+60)*h;ctx.beginPath();ctx.moveTo(x,ly2);ctx.lineTo(x+w,ly2+hashRand(r,c,i+61)*6-3);ctx.stroke();}
      ctx.globalAlpha=0.28;ctx.fillStyle=theme.wallHi;ctx.fillRect(x,y+h-4,w,4);ctx.globalAlpha=1;
    } else if (s==='crystal') {
      var g=ctx.createLinearGradient(x,y,x+w,y+h);
      g.addColorStop(0,theme.wallHi);g.addColorStop(0.5,theme.wallBase);g.addColorStop(1,theme.wallDk);
      ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallHi;ctx.lineWidth=0.8;ctx.globalAlpha=0.7;
      ctx.beginPath();ctx.moveTo(x+w*0.5,y);ctx.lineTo(x+w*0.2,y+h);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+w*0.8,y);ctx.lineTo(x+w*0.5,y+h);ctx.stroke();ctx.globalAlpha=1;
    } else if (s==='brick') {
      ctx.fillStyle=theme.wallBase;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallDk;ctx.lineWidth=0.8;ctx.globalAlpha=0.5;
      var rh2=Math.max(6,h/3);
      for(var row=0;row<4;row++){
        var sy2=y+row*rh2,off=(row%2)*8;
        ctx.beginPath();ctx.moveTo(x,sy2);ctx.lineTo(x+w,sy2);ctx.stroke();
        for(var bx=x+off;bx<x+w;bx+=14){ctx.beginPath();ctx.moveTo(bx,sy2);ctx.lineTo(bx,sy2+rh2);ctx.stroke();}
      }ctx.globalAlpha=1;
    } else if (s==='ice') {
      var g=ctx.createLinearGradient(x,y,x+w,y+h);
      g.addColorStop(0,'#eef6ff');g.addColorStop(1,theme.wallBase);
      ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallHi;ctx.lineWidth=0.8;ctx.globalAlpha=0.8;
      ctx.beginPath();ctx.moveTo(x+w*0.2,y);ctx.lineTo(x+w*0.4,y+h*0.4);ctx.lineTo(x+w*0.6,y+h*0.2);ctx.stroke();
      ctx.globalAlpha=0.3;ctx.fillStyle='#fff';ctx.fillRect(x,y,w,Math.max(2,h*0.28));ctx.globalAlpha=1;
    } else if (s==='neon') {
      ctx.fillStyle=theme.wallBase;ctx.fillRect(x,y,w,h);
      var colors=['#ff0080','#00ffcc','#8000ff'];
      var col=colors[Math.floor(hashRand(r,c,70)*3)];
      ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.globalAlpha=0.85;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
      ctx.globalAlpha=0.28;ctx.fillStyle=col;ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;
    } else if (s==='gold') {
      var g=ctx.createLinearGradient(x,y,x+w,y+h);
      g.addColorStop(0,theme.wallHi);g.addColorStop(0.4,theme.wallBase);g.addColorStop(1,theme.wallDk);
      ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle=theme.wallHi;ctx.lineWidth=1;ctx.globalAlpha=0.6;ctx.strokeRect(x+1,y+1,w-2,h-2);ctx.globalAlpha=1;
    } else if (s==='coral') {
      ctx.fillStyle=theme.wallBase;ctx.fillRect(x,y,w,h);
      ctx.fillStyle=theme.wallHi;ctx.globalAlpha=0.5;
      for(var i=0;i<3;i++){var bx2=x+hashRand(r,c,i+80)*(w-6)+3,by2=y+hashRand(r,c,i+81)*(h-6)+3;ctx.beginPath();ctx.arc(bx2,by2,3+hashRand(r,c,i+82)*3,0,Math.PI*2);ctx.fill();}
      ctx.globalAlpha=1;
    } else if (s==='manor') {
      ctx.fillStyle=theme.wallDk;ctx.fillRect(x,y,w,h);
      ctx.fillStyle=theme.wallBase;ctx.globalAlpha=0.65;ctx.fillRect(x,y,w,Math.max(2,h*0.2));
      ctx.fillStyle=theme.wallHi;ctx.globalAlpha=0.18;ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;
    } else if (s==='volcanic') {
      ctx.fillStyle=theme.wallDk;ctx.fillRect(x,y,w,h);
      ctx.strokeStyle='#ff4400';ctx.lineWidth=1;ctx.globalAlpha=0.65;
      var lx2=x+hashRand(r,c,95)*w;ctx.beginPath();ctx.moveTo(lx2,y);ctx.lineTo(lx2+4,y+h*0.5);ctx.lineTo(lx2-2,y+h);ctx.stroke();ctx.globalAlpha=1;
    } else {
      ctx.fillStyle=theme.wallBase;ctx.fillRect(x,y,w,h);
      ctx.fillStyle=theme.wallHi;ctx.globalAlpha=0.55;
      for(var i=0;i<2;i++){ctx.beginPath();ctx.arc(x+hashRand(r,c,i+100)*w,y+hashRand(r,c,i+101)*h,4+hashRand(r,c,i+102)*4,0,Math.PI*2);ctx.fill();}
      ctx.globalAlpha=1;
    }
  }

  function drawPath(ctx,x,y,s,r,c,theme){
    ctx.fillStyle=(r+c)%2===0?theme.path1:theme.path2;ctx.fillRect(x,y,s,s);
    ctx.strokeStyle=theme.grout;ctx.lineWidth=0.5;ctx.globalAlpha=0.4;
    ctx.beginPath();ctx.moveTo(x+s/2,y);ctx.lineTo(x+s/2,y+s);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x,y+s/2);ctx.lineTo(x+s,y+s/2);ctx.stroke();
    ctx.globalAlpha=1;
  }

  function drawStart(ctx,x,y,s){
    var cx=x+s/2,cy=y+s/2,w2=s*0.62,h2=s*0.55,x0=cx-w2/2,y0=cy-h2/2+2;
    ctx.fillStyle='#faf4e8';ctx.fillRect(x0,y0,w2,h2);
    ctx.fillStyle='#c05030';ctx.beginPath();ctx.moveTo(x0-3,y0);ctx.lineTo(cx,y0-h2*0.55);ctx.lineTo(x0+w2+3,y0);ctx.closePath();ctx.fill();
    ctx.fillStyle='#7a4828';ctx.fillRect(cx-3,y0+h2-8,6,8);
    ctx.fillStyle='#fff8e0';ctx.font='bold '+Math.max(7,s*0.14)+'px sans-serif';ctx.textAlign='center';ctx.fillText('START',cx,y+s-3);
  }

  function drawEnd(ctx,x,y,s,dest){
    var cx=x+s/2,cy=y+s/2,w2=s*0.76,h2=s*0.48,x0=cx-w2/2,y0=cy-h2/2+3;
    ctx.fillStyle='#3a2a1a';ctx.fillRect(x0,y0+h2*0.55,w2,h2*0.45);
    ctx.fillStyle=dest.awning;ctx.fillRect(x0-3,y0,w2+6,8);
    ctx.fillStyle='rgba(255,255,255,0.3)';
    for(var i=0;i<5;i+=2)ctx.fillRect(x0-3+i*(w2+6)/5,y0,(w2+6)/5,8);
    ctx.font=Math.max(14,s*0.44)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(dest.emoji,cx,cy+3);
    ctx.textBaseline='alphabetic';ctx.fillStyle='#fff8e0';ctx.font='600 '+Math.max(7,s*0.12)+'px sans-serif';
    ctx.textAlign='center';var short=dest.name.length>13?dest.name.slice(0,12)+'\u2026':dest.name;ctx.fillText(short,cx,y+s-2);
  }

  function renderBase(canvas,maze,cellPx){
    var ctx=canvas.getContext('2d'),size=maze.size,total=size*cellPx;
    canvas.width=total;canvas.height=total;
    var theme=THEMES[maze.name]||THEMES['6x6-1'];
    ctx.fillStyle=theme.bg;ctx.fillRect(0,0,total,total);
    for(var r=0;r<size;r++)for(var c=0;c<size;c++)drawPath(ctx,c*cellPx,r*cellPx,cellPx,r,c,theme);
    var wt=Math.max(7,cellPx*0.22);
    for(var r=0;r<size;r++)for(var c=0;c<size;c++){
      var w=maze.walls[r][c],x=c*cellPx,y=r*cellPx;
      if(w.n&&r>0)drawWall(ctx,x,y-wt/2,cellPx,wt,r,c,theme);
      if(w.w&&c>0)drawWall(ctx,x-wt/2,y,wt,cellPx,r,c,theme);
    }
    drawWall(ctx,-wt/2,-wt/2,total+wt,wt,0,0,theme);
    drawWall(ctx,-wt/2,total-wt/2,total+wt,wt,size,0,theme);
    drawWall(ctx,-wt/2,-wt/2,wt,total+wt,0,0,theme);
    drawWall(ctx,total-wt/2,-wt/2,wt,total+wt,0,size,theme);
    // level badge
    ctx.fillStyle='rgba(0,0,0,0.38)';ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(4,4,Math.min(130,total-8),19,4);else ctx.rect(4,4,Math.min(130,total-8),19);
    ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.88)';ctx.font='bold '+Math.max(8,cellPx*0.17)+'px sans-serif';ctx.textAlign='left';ctx.fillText(theme.name,10,18);
    var sx=maze.start[1]*cellPx,sy=maze.start[0]*cellPx,ex=maze.end[1]*cellPx,ey=maze.end[0]*cellPx;
    drawStart(ctx,sx,sy,cellPx);
    var dest=window.DESTINATIONS[maze.name]||{name:maze.name,emoji:'🏁',awning:'#c8a030'};
    drawEnd(ctx,ex,ey,cellPx,dest);
  }

  function drawTrail(ctx,traj,cellPx,color,opacity,upToStep){
    opacity=opacity===undefined?1:opacity;upToStep=upToStep===undefined?-1:upToStep;
    if(!traj||traj.length<2)return;
    var stop=upToStep<0?traj.length:Math.min(upToStep+1,traj.length);
    ctx.save();ctx.globalAlpha=opacity;ctx.strokeStyle=color;
    ctx.lineWidth=Math.max(2.5,cellPx*0.13);ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();
    for(var i=0;i<stop;i++){var rc=traj[i],x=rc[1]*cellPx+cellPx/2,y=rc[0]*cellPx+cellPx/2;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();
    if(stop>0){var rc=traj[stop-1];ctx.fillStyle=color;ctx.globalAlpha=opacity*0.38;ctx.beginPath();ctx.arc(rc[1]*cellPx+cellPx/2,rc[0]*cellPx+cellPx/2,cellPx*0.2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }

  function drawIdealPath(ctx,path,cellPx){
    if(!path||path.length<2)return;
    ctx.save();ctx.strokeStyle='rgba(255,255,255,0.32)';ctx.lineWidth=Math.max(1.5,cellPx*0.07);ctx.setLineDash([4,4]);ctx.lineCap='round';
    ctx.beginPath();
    for(var i=0;i<path.length;i++){var rc=path[i],x=rc[1]*cellPx+cellPx/2,y=rc[0]*cellPx+cellPx/2;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();ctx.restore();
  }

  function drawMinotaur(ctx,modelKey,pos,cellPx,opts){
    opts=opts||{};
    var img=window.minotaurTokens[modelKey];
    var r=pos[0],c=pos[1],x=c*cellPx,y=r*cellPx;
    var scale=opts.scale||1,subTotal=opts.subTotal||1,subIndex=opts.subIndex||0;
    var dx=0,dy=0;
    if(subTotal>1){var ang=(subIndex/subTotal)*Math.PI*2-Math.PI/2,rad=cellPx*0.2;dx=Math.cos(ang)*rad;dy=Math.sin(ang)*rad;}
    var tokenSize=cellPx*0.8*scale,cx=x+cellPx/2+dx,cy=y+cellPx/2+dy,tx=cx-tokenSize/2,ty=cy-tokenSize/2;
    var m=window.MINOTAURS[modelKey];
    if(m){
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,tokenSize/2+3,0,Math.PI*2);ctx.fillStyle=m.fur;ctx.globalAlpha=0.2;ctx.fill();ctx.restore();
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,tokenSize/2+1,0,Math.PI*2);ctx.strokeStyle=m.fur;ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
    }
    if(img&&img.complete)ctx.drawImage(img,tx,ty,tokenSize,tokenSize);
    else{ctx.fillStyle=m?m.fur:'#aaa';ctx.beginPath();ctx.arc(cx,cy,tokenSize*0.38,0,Math.PI*2);ctx.fill();}
    if(opts.finished){ctx.save();ctx.fillStyle='#ffd24a';ctx.font=(cellPx*0.34)+'px serif';ctx.textAlign='center';ctx.fillText('★',cx,ty-2);ctx.restore();}
  }

  return {renderBase,drawTrail,drawIdealPath,drawMinotaur};
})();
