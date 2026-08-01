(function(){
  var list = document.getElementById('list');
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function render(filter){
    list.innerHTML = DATA.filter(function(d){ return filter==='all' || d.level===filter; }).map(function(d){
      return '<div class="card" data-level="'+d.level+'">'
        + '<div class="rowtop"><span class="no">SET '+String(d.no).padStart(2,'0')+'</span><span class="lvl '+d.level+'">'+d.level+'</span></div>'
        + '<h3>'+esc(d.title)+'</h3>'
        + '<span class="method-pill">'+esc(d.pattern)+'</span>'
        + '<ul class="clues">'+d.clues.map(function(c){return '<li>'+esc(c)+'</li>';}).join('')+'</ul>'
        + '<div class="btns"><button data-t="hint">💡 Hint</button><button data-t="sol">✅ Solution + Answer</button></div>'
        + '<div class="panel hint"><b>Kahan se start karein:</b><ul>'+d.hint.map(function(h){return '<li>'+esc(h)+'</li>';}).join('')+'</ul></div>'
        + '<div class="panel sol"><b>Step-by-step:</b><ol>'+d.steps.map(function(s){return '<li>'+esc(s)+'</li>';}).join('')+'</ol>'
        + '<div class="final">'+esc(d.final)+'</div>'
        + '<div class="qa">'+d.qa.map(function(q){return '<div>Q. '+esc(q[0])+' <b>→ '+esc(q[1])+'</b></div>';}).join('')+'</div></div>'
        + '</div>';
    }).join('');
  }
  render('all');
  list.addEventListener('click', function(e){
    var b = e.target.closest('button[data-t]');
    if(!b) return;
    var card = b.closest('.card');
    var p = card.querySelector('.panel.'+b.dataset.t);
    p.classList.toggle('open');
  });
  document.querySelectorAll('.controls button[data-f]').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.controls button[data-f]').forEach(function(x){x.classList.remove('active');});
      btn.classList.add('active');
      render(btn.dataset.f);
    });
  });
  document.getElementById('expandAll').addEventListener('click', function(){
    var any = !!document.querySelector('.panel.sol:not(.open)');
    document.querySelectorAll('.panel').forEach(function(p){ p.classList.toggle('open', any); });
  });
})();
