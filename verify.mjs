import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const curriculumSource = readFileSync(new URL('./dist/curriculum.js', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('./dist/app.js', import.meta.url), 'utf8');
const elements = new Map();
const element = key => {
  if (!elements.has(key)) elements.set(key, {innerHTML:'',textContent:'',hidden:true,classList:{toggle(){}},addEventListener(){},setAttribute(){},getAttribute(){return 'false';},toggleAttribute(){},focus(){},scrollIntoView(){}});
  return elements.get(key);
};
const stored = new Map();
const context = vm.createContext({
  document:{getElementById:element,querySelector:element,addEventListener(){},title:''},
  localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},
  location:{hash:'#/'},window:{addEventListener(){},scrollTo(){}}
});
vm.runInContext(curriculumSource + '\n' + appSource,context);
const curriculum=vm.runInContext('CURRICULUM',context);
const expected = {
  '6-1':['3/4','3/5','15','0.75','1/2'],
  '6-2':['10','20','25%','$54','75 g'],
  '6-3':['40 cm²','30 cm²','55°','64 cm³','20 m'],
  '7-1':['5','−24','5x','13','3x + 12'],
  '7-2':['x = 5','x = 7','15','$30','x = 20'],
  '7-3':['70°','1/6','2/5','65°','14 cm'],
  '8-1':['16','9','3⁵','1','4.2 × 10⁻⁴'],
  '8-2':['x = 8','14','2','−5','(2, 5)'],
  '8-3':['5 cm','7','7','9π cm²','9'],
  '9-1':['x² + 5x + 6','(x + 3)(x + 4)','x = 2 or −3','4x²','x = 7 or −7'],
  '9-2':['Opposite / hypotenuse','5 cm','0.75','13 cm','4 : 9'],
  '9-3':['1/4','1/3','3/10','Median','7']
};
let questions=0, routes=0;
function route(path){context.location.hash='#'+path;vm.runInContext('render()',context);const html=element('main').innerHTML;assert.ok(html.length>500);assert.ok(!html.includes('A little detour.'));routes++;return html;}
route('/');route('/grades');
for(const g of [6,7,8,9]){
  assert.equal(curriculum[g].levels.length,3);route(`/grade/${g}`);
  curriculum[g].levels.forEach((lesson,i)=>{
    const l=i+1,key=`${g}-${l}`;
    assert.equal(lesson.questions.length,5);
    assert.equal(lesson.rules.length,3);
    lesson.questions.forEach((q,n)=>{
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4);
      assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
      assert.equal(q.options[q.answer],expected[key][n],`Incorrect answer key at ${key}, question ${n+1}`);
      assert.ok(q.explanation.trim().length>0);questions++;
    });
    for(const tab of ['content','exercises','results'])route(`/grade/${g}/level/${l}/${tab}`);
    vm.runInContext(`stateFor(${g},${l}).answers=CURRICULUM[${g}].levels[${i}].questions.map(q=>q.answer)`,context);
    assert.equal(vm.runInContext(`scoreFor(${g},${l})`,context),5);
    vm.runInContext(`stateFor(${g},${l}).answers=CURRICULUM[${g}].levels[${i}].questions.map(q=>(q.answer+1)%4)`,context);
    assert.equal(vm.runInContext(`scoreFor(${g},${l})`,context),0);
  });
}
context.location.hash='#/grade/constructor';vm.runInContext('render()',context);assert.ok(element('main').innerHTML.includes('A little detour.'));
console.log(`Verified ${routes} pages, ${questions} answer keys, and perfect/zero scoring for all 12 levels.`);
