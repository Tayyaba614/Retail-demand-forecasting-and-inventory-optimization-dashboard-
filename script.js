const products = [
  {name:"Cooking Oil 1L",category:"Grocery",stock:42,price:610,daily:18,history:[20,22,19,25,23,28,26]},
  {name:"Wheat Flour 10kg",category:"Grocery",stock:95,price:1450,daily:12,history:[11,12,10,14,13,15,12]},
  {name:"Milk 1L",category:"Dairy",stock:28,price:250,daily:16,history:[15,17,16,18,14,19,16]},
  {name:"Tea 190g",category:"Beverages",stock:76,price:520,daily:7,history:[6,8,7,9,8,7,6]},
  {name:"Laundry Soap",category:"Household",stock:19,price:180,daily:9,history:[8,10,9,11,8,9,10]},
  {name:"Bottled Water 1.5L",category:"Beverages",stock:140,price:110,daily:20,history:[18,22,24,20,21,19,23]},
  {name:"Biscuits Family Pack",category:"Snacks",stock:31,price:160,daily:11,history:[10,12,13,11,9,12,10]},
  {name:"Shampoo 185ml",category:"Personal Care",stock:24,price:430,daily:4,history:[4,5,3,4,6,4,3]}
];
const leadTimeDays = 3, safetyStockDays = 2, targetCoverDays = 7;
const reorderPoint = p => Math.ceil(p.daily * (leadTimeDays + safetyStockDays));
const targetStock = p => Math.ceil(p.daily * (leadTimeDays + safetyStockDays + targetCoverDays));
const suggestedOrder = p => Math.max(0, targetStock(p) - p.stock);
const money = n => "₨" + Math.round(n).toLocaleString("en-PK");
const statusFor = p => p.stock <= p.daily * leadTimeDays ? ["Low stock","low"] : p.stock <= reorderPoint(p) ? ["Reorder soon","watch"] : ["Healthy","healthy"];

function renderKPIs(){
  const units = products.reduce((s,p)=>s+p.history.reduce((a,b)=>a+b,0),0);
  const value = products.reduce((s,p)=>s+p.history.reduce((a,b)=>a+b,0)*p.price,0);
  const needs = products.filter(p=>p.stock<=reorderPoint(p));
  document.getElementById("unitsSold").textContent=units.toLocaleString("en-PK");
  document.getElementById("salesValue").textContent=money(value);
  document.getElementById("reorderCount").textContent=needs.length;
  document.getElementById("replenishUnits").textContent=needs.reduce((s,p)=>s+suggestedOrder(p),0).toLocaleString("en-PK");
}
function renderInventory(){
  const q=document.getElementById("searchInput").value.toLowerCase();
  const rows=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q));
  document.getElementById("inventoryBody").innerHTML=rows.map(p=>{
    const [label,cls]=statusFor(p);
    return `<tr><td>${p.name}</td><td>${p.category}</td><td>${p.stock}</td><td>${p.daily} units</td><td>${reorderPoint(p)} units</td><td><span class="pill ${cls}">${label}</span></td></tr>`;
  }).join("");
  document.getElementById("tableCount").textContent=`Showing ${rows.length} of ${products.length} sample products`;
}
function renderRecommendations(){
  const rows=products.filter(p=>p.stock<=reorderPoint(p)).sort((a,b)=>suggestedOrder(b)-suggestedOrder(a));
  document.getElementById("recommendationBody").innerHTML=rows.length?rows.map(p=>{
    const priority=p.stock<=p.daily*leadTimeDays?["High","low"]:["Medium","watch"];
    return `<tr><td>${p.name}</td><td>${p.stock}</td><td>${reorderPoint(p)}</td><td>${targetStock(p)}</td><td><strong>${suggestedOrder(p)} units</strong></td><td><span class="pill ${priority[1]}">${priority[0]}</span></td></tr>`;
  }).join(""):`<tr><td colspan="6">No products currently require reordering in this sample.</td></tr>`;
}
let chart;
function renderChart(){
  const selected=products.find(p=>p.name===document.getElementById("productSelect").value)||products[0];
  const average=selected.history.reduce((a,b)=>a+b,0)/selected.history.length;
  const forecast=Array.from({length:3},(_,i)=>Math.round(average*(1+(i-1)*0.03)));
  if(chart)chart.destroy();
  chart=new Chart(document.getElementById("forecastChart"),{
    type:"line",
    data:{labels:["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7","Forecast +1","Forecast +2","Forecast +3"],datasets:[
      {label:"Historical units sold",data:[...selected.history,...Array(3).fill(null)],borderColor:"#356ae6",backgroundColor:"rgba(53,106,230,.10)",fill:true,tension:.35,pointRadius:3,spanGaps:false},
      {label:"Baseline forecast",data:[...Array(6).fill(null),selected.history[6],...forecast],borderColor:"#e69b35",backgroundColor:"rgba(230,155,53,.08)",borderDash:[6,5],tension:.35,pointRadius:3,spanGaps:true}
    ]},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{labels:{usePointStyle:true,boxWidth:7,font:{family:"DM Sans",size:11}}}},scales:{x:{grid:{display:false},ticks:{font:{size:10}}},y:{beginAtZero:true,title:{display:true,text:"Units sold",font:{size:10}},grid:{color:"#edf0f5"},ticks:{precision:0}}}}
  });
}
function exportCSV(){
  const header=["Product","Category","Current Stock","Average Daily Demand","Reorder Point","Target Stock","Suggested Order","Status"];
  const rows=products.map(p=>[p.name,p.category,p.stock,p.daily,reorderPoint(p),targetStock(p),suggestedOrder(p),statusFor(p)[0]]);
  const csv=[header,...rows].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="retail-inventory-recommendations.csv";a.click();URL.revokeObjectURL(url);
}
document.getElementById("productSelect").innerHTML=products.map(p=>`<option value="${p.name}">${p.name}</option>`).join("");
document.getElementById("productSelect").addEventListener("change",renderChart);
document.getElementById("searchInput").addEventListener("input",renderInventory);
document.getElementById("exportBtn").addEventListener("click",exportCSV);
renderKPIs();renderInventory();renderRecommendations();renderChart();
