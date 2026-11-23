const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={window:null,document:{addEventListener(){}},Number,Math,Array}; c.window=c;
vm.createContext(c);
for(const f of ['js/app.js','model-weights.js','ai-assessment.js']) vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),c);
let n=0;
for(const amount of ['mild','nose','severe']) for(const object of ['no','yes']) for(const limb of ['no','yes']) {
 const a={amount,object,limb};const expected=amount==='nose'?'nose':object==='yes'?'embedded':amount==='severe'?(limb==='yes'?'severe_limb':'severe_body'):'mild';
 assert.equal(c.predictEducationalModel(a),expected); assert.equal(c.pickResult(a),expected); n++;
}
for(const a of [{amount:'nose'},{amount:'mild',object:'no'},{amount:'mild',object:'yes'},{amount:'severe',object:'yes'},{amount:'severe',object:'no',limb:'yes'},{amount:'severe',object:'no',limb:'no'}]) assert.equal(c.predictEducationalModel(a),c.pickResult(a));
// A deliberately incorrect ML classifier must not downgrade any severe case.
const model=c.BLEEDING_MODEL; c.BLEEDING_MODEL={weights:[[0,0,0,0,0,0,0]],bias:[0],classes:['mild']};
for(const object of ['yes','no']) for(const limb of ['yes','no']) assert(c.RESULTS[c.pickResult({amount:'severe',object,limb})].urgent);
for(const broken of [undefined,{}, {weights:[[NaN]],bias:[0],classes:['mild']}]) {
 c.BLEEDING_MODEL=broken;assert.equal(c.predictEducationalModel({amount:'severe'}),null);assert(c.RESULTS[c.pickResult({amount:'severe',object:'no',limb:'yes'})].urgent);
}
c.BLEEDING_MODEL=model; console.log('PASS: '+n+' model combinations; 6 reachable paths; wrong/missing/malformed model safety checks. Software tests only, not clinical validation.');
