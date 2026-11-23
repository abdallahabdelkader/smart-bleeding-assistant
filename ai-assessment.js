/* Educational ML inference. The original safety rules alone select care instructions. */
(function () {
  'use strict';
  var labels = {mild:'جرح بسيط',nose:'نزيف أنف',embedded:'جسم مغروس',severe_limb:'نزيف شديد في طرف',severe_body:'نزيف شديد في مكان آخر'};
  function predict(a) {
    var m = window.BLEEDING_MODEL;
    if (!m || !Array.isArray(m.weights) || !Array.isArray(m.bias)) return null;
    if (['mild','nose','severe'].indexOf(a.amount) < 0) return null;
    // Questions not asked are assigned a neutral default used in training.
    var x = ['mild','nose','severe'].map(function(v){return +(a.amount===v);})
      .concat(['no','yes'].map(function(v){return +((a.object || 'no')===v);}))
      .concat(['no','yes'].map(function(v){return +((a.limb || 'no')===v);}));
    try {
      var scores = m.weights.map(function(w,i){return w.reduce(function(s,v,j){return s+v*x[j];},m.bias[i]);});
      if (!scores.every(Number.isFinite)) return null;
      return m.classes[scores.indexOf(Math.max.apply(null,scores))] || null;
    } catch(e) { return null; }
  }
  window.predictEducationalModel = predict;
  var originalPick = window.pickResult;
  var last = null;
  window.pickResult = function(a) {
    var rule = originalPick(a);
    // Emergency guard is independent of model availability or prediction.
    if (a.amount === 'severe') rule = a.object === 'yes' ? 'embedded' : a.limb === 'yes' ? 'severe_limb' : 'severe_body';
    else if (a.object === 'yes' && a.amount !== 'nose') rule = 'embedded';
    last = {model:predict(a),safe:rule};
    return rule;
  };
  document.addEventListener('DOMContentLoaded', function(){
    var area=document.getElementById('result-area');
    if(!area) return;
    new MutationObserver(function(){
      if(!last || !area.querySelector('.result-card') || area.querySelector('.ml-note')) return;
      var box=document.createElement('section'); box.className='note ml-note';
      var heading=document.createElement('h3'); heading.textContent='تجربة نموذج التعلم الآلي'; box.appendChild(heading);
      var p=document.createElement('p');
      p.textContent=last.model ? 'تصنيف النموذج التعليمي: '+labels[last.model]+'. '+(last.model===last.safe?'يتفق مع قواعد الأمان في هذه الإجابات.':'يختلف عن قواعد الأمان. تم تجاهل تصنيفه في تعليمات الإسعاف.') : 'النموذج غير متاح. تعليمات الإسعاف مستمرة بقواعد الأمان فقط.';
      box.appendChild(p);
      var detail=document.createElement('p'); detail.textContent='نموذج Logistic Regression متدرب على 12 مثال صناعي مولّد من القواعد، وليس على حالات مرضى. يتعلم تقليد القواعد للتوضيح فقط، بلا تحقق سريري أو ادعاء دقة طبية. تعليمات الإسعاف فوق من قواعد ثابتة، وليست من النموذج. ليس تشخيصًا أو بديلًا للمساعدة الطبية.';
      box.appendChild(detail); area.appendChild(box);
    }).observe(area,{childList:true});
  });
})();
